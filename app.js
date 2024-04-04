const liveHeadingContainer = document.querySelector(".live-heading-container");
const liveCircle = document.querySelector(".live-circle");
const liveHeading = document.querySelector(".live-heading");
const courtneyTrackerHeading = document.querySelector(".courtney-tracker-heading");
const mainContainer = document.querySelector(".main-container");
const eventTitle = document.querySelector(".event-title");
const leftContainer = document.querySelector(".left-container");
const icon = document.querySelector(".icon");
const timeSubtitle = document.querySelector(".time-subtitle");
const timeTitle = document.querySelector(".time-title");
const rightContainer = document.querySelector(".right-container");
const eventPropertyContainer = document.querySelector(".event-property-container");
const visible2 = document.querySelector(".visible-2");
const eventPropertyButtons = [
  document.querySelector(".event-time-button"),
  document.querySelector(".event-location-button"),
  document.querySelector(".event-schedule-button")
];
const eventPropertyHeading = document.querySelector(".event-property-heading");
const eventPropertyDescription = document.querySelector(".event-property-description");
const scheduleContainer = document.querySelector(".schedule-container");

const windowWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
let computerDevice;
const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQFcJGeT4BrV79wF4YoS1Ssrjg0MaMG3Htlo17y5fTxG3wSxlQ7PfTW0ZAW5NsMG6cgs2SdAltiUUKE/pub?gid=0&single=true&output=csv";

const programs = {
  "School" : {
    color : "#0f721f",
    icon : "icons/School.png",
    "Badminton Tryouts" : {
      color : "#158dfb",
      icon : "icons/Badminton.png"
    }
  },
  "CMO" : {
    color : "#b8751e",
    icon : "icons/CMO.png",
    "go poop" : {
      color : "#b8751e",
      icon : "icons/poophahhahahahaha.png"
    }
  },
  "Cadets" : {
    color : "#04254a",
    icon : "icons/Cadets.png"
  },
  "CPL Volunteering" : {
    color : "#6b1f80",
    icon : "",
    "Coding Buddies" : {
      color : "#6b1f80",
      icon : "icons/CodingBuddies.png"
    }
  },
  "Personal" : {
    color : "",
    icon : "",
    "Free" : {
      color : "#7e7e7e",
      icon : "icons/Free.png"
    },
    "Sleep" : {
      color : "#252525",
      icon : "icons/Sleep.png"
    }
  }
};

let eventPropertiesVisible = false;
let visibilityTransitionActive = false;
let currentEventPropertyButton;
let currentEvent;
let todaysEvents;

rightContainer.style["background-color"] = "#252525";
liveHeadingContainer.style["border-color"] = "#252525";
liveCircle.style["border-color"] = "#252525";
liveCircle.style["background-color"] = "#252525";
liveHeading.style.color = "#252525";
liveHeading.style["border-color"] = "#252525";
courtneyTrackerHeading.style.color = "#252525";

async function getData(url) {
  const response = await fetch(url);

  return response.text();
}

function getCurrentEvent(todaysEvents) {
 const _currentEvent = todaysEvents.find(
    event => (
      new Date()).getTime() >= (new Date(event.startTime)).getTime() && (new Date()).getTime() < (new Date(event.endTime)).getTime())
  || {
    date : new Date().toDateString(),
    startTime : todaysEvents.reduce((prev, curr) => new Date(curr.endTime).getTime() <= new Date().getTime() && (new Date().getTime() - (new Date(curr.endTime)).getTime() < new Date().getTime() - (new Date(prev.endTime)).getTime()) ? curr : prev).endTime,
    endTime : (todaysEvents.filter(event => new Date(event.startTime).getTime() > new Date().getTime()).reduce((prev, curr) => (new Date(curr.startTime).getTime() < new Date(prev.startTime).getTime()) && curr || prev)).startTime,
    program : "Personal",
    title : "Free",
    location : "Home; 308 Negra Arroya Lane"
  }

  return _currentEvent;
}

function updateEvent(_currentEvent) {
  currentEvent = _currentEvent;
  
  // console.log(currentEvent);
  // console.log(programs[currentEvent.program]);

  const programColor = programs[currentEvent.program][currentEvent.title] && programs[currentEvent.program][currentEvent.title].color || programs[currentEvent.program].color;

  timeSubtitle.style.color = programColor;
  timeTitle.style.color = programColor;
  rightContainer.style["background-color"] = programColor;
  liveHeadingContainer.style["border-color"] = programColor;
  liveCircle.style["border-color"] = programColor;
  liveCircle.style["background-color"] = programColor;
  liveHeading.style.color = programColor;
  liveHeading.style["border-color"] = programColor;
  courtneyTrackerHeading.style.color = computerDevice && "#ffffff" || programColor;
  eventTitle.innerHTML = currentEvent.title;
  icon.src = programs[currentEvent.program][currentEvent.title] && programs[currentEvent.program][currentEvent.title].icon || programs[currentEvent.program].icon;
}

let timeTimeoutId;
function updateEventProperty(eventProperty) {
  const eventMinutes = Math.ceil(((new Date(currentEvent.endTime)).getTime() - (new Date()).getTime()) / 1000 / 60);
  const eventPropertyHeadingText = 
    eventProperty == "time" &&
      (new Date(currentEvent.startTime)).toLocaleTimeString().replace(":00 AM", "am").replace(":00 PM", "pm").replace(":00 a.m.", "am").replace(":00 p.m.", "pm") + "-" + (new Date(currentEvent.endTime)).toLocaleTimeString().replace(":00 AM", "am").replace(":00 PM", "pm").replace(":00 a.m.", "am").replace(":00 p.m.", "pm")
    || eventProperty == "location" &&
      (currentEvent.program == "Personal" && "Home" || currentEvent.location.split("; ")[0])
    || "";
  const eventPropertyDescriptionText =
    eventProperty == "time" &&
      ((eventMinutes % 60 == 0 && eventMinutes / 60 + (eventMinutes == 60 && " hour left" || " hours left")) || (eventMinutes > 60 && Math.floor(eventMinutes / 60) + (Math.floor(eventMinutes / 60) == 1 && " hour and " || " hours and ") + (eventMinutes - (Math.floor(eventMinutes / 60) * 60)) + (eventMinutes - (Math.floor(eventMinutes / 60) * 60) == 1 && " minute left" || " minutes left")) || (eventMinutes + (eventMinutes == 1 && " minute left" || " minutes left")))
    || eventProperty == "location" &&
      (currentEvent.program == "Personal" && "308 Negra Arroya Lane" || currentEvent.location.split("; ")[1])
    || "";
  console.log(eventProperty);
  eventPropertyHeading.innerHTML = eventPropertyHeadingText;
  eventPropertyDescription.innerHTML = eventPropertyDescriptionText;

  if (eventProperty == "schedule") {
    eventPropertyContainer.style.height = "auto";
    scheduleContainer.style["padding-top"] = "30%";
  } else {
    scheduleContainer.style["transition"] = "padding-top 0s";
    scheduleContainer.style["padding-top"] = "0%";
    eventPropertyContainer.style.height = "4vw";
  }

  if (eventProperty == "time" && eventPropertiesVisible == true) {
    timeTimeoutId = setTimeout(updateEventProperty, 1000 - new Date().getMilliseconds(), eventProperty);
  } else {
    clearTimeout(timeTimeoutId);
  }
}

function updateTime() {
  timeSubtitle.innerHTML = new Date().toDateString().replace(" ", ", ").replace(new Date().toDateString().replace(" ", ", ").slice(-5), "");
  timeTitle.innerHTML = new Date().toLocaleTimeString("en-US").replace(" AM", "am").replace(" PM", "pm");
}

function refreshCurrentEvent(todaysEvents) {
  updateEvent(getCurrentEvent(todaysEvents));
  updateTime();
  setTimeout(() => refreshCurrentEvent(todaysEvents), 1000 - new Date().getMilliseconds());
}

function retrieveAndUseData(url) {
  computerDevice = window.innerWidth > window.innerHeight;

  timeSubtitle.style["font-size"] = computerDevice && "1.2vw" || "2.4vw";
  timeTitle.style["font-size"] = computerDevice && "4vw" || "8vw";

  eventTitle.style["font-size"] = computerDevice && "4vw" || "8vw";
  eventPropertyButtons.forEach(eventPropertyButton => {
    eventPropertyButton.style.width = computerDevice && "2.5vw" || "5vw";
    eventPropertyButton.style["padding-top"] = computerDevice && "2.5vw" || "5vw";
    eventPropertyButton.style["margin-left"] = computerDevice && "0.2vw" || "0.4vw";
    eventPropertyButton.style["margin-right"] = computerDevice && "0.2vw" || "0.4vw";
  });
  
  liveHeading.style["font-size"] = computerDevice && "1vw" || "2vw";
  liveCircle.style.width = computerDevice && "0.2vw" || "0.4vw";
  liveCircle.style.height = computerDevice && "0.2vw" || "0.4vw";
  liveCircle.style["margin-left"] = computerDevice && "0.3vw" || "0.6vw";
  liveHeadingContainer.style["border-width"] = computerDevice && "0.2vw" || "0.4vw";
  liveHeadingContainer.style["border-radius"] = computerDevice && "0.5vw" || "1vw";
  liveHeadingContainer.style.margin = computerDevice && "0.7%" || "1.4%";
  liveHeadingContainer.style.padding = computerDevice && "0.3%" || "0.6%";
  courtneyTrackerHeading.style["font-size"] = computerDevice && "1vw" || "2vw";
  courtneyTrackerHeading.style.padding = computerDevice && "1%" || "2%";
  eventPropertyContainer.style["padding-top"] = computerDevice && "2%" || "4%";
  eventPropertyHeading.style["font-size"] = computerDevice && "2vw" || "4vw";
  eventPropertyDescription.style["font-size"] = computerDevice && "1.2vw" || "2.4vw";

  getData(url).then((data) => {
    const allEvents = data.split(/\r?\n/).map((eventText) => eventText.split(",")).map((event) => {
      return {
        date : event[1],
        startTime : event[2],
        endTime : event[3],
        program : event[4],
        title : event[5],
        location : event[6].replaceAll(";", ",").replace(",", ";")
      };
    });
    todaysEvents = allEvents.filter(event => event.date == (new Date()).toDateString() || (new Date(event.endTime)).toDateString() == (new Date()).toDateString());

    console.log(todaysEvents);
    
    eventPropertyButtons.forEach(handleEventPropertyButton);
    
    refreshCurrentEvent(todaysEvents);
    
    setTimeout(() => {
      mainContainer.style["flex-direction"] = computerDevice && "row" || "column";
      leftContainer.style.transition = computerDevice && "width 2s, height 0s" || "width 0s, height 2s";
      leftContainer.style.width = computerDevice && "50%" || "100%";
      leftContainer.style.height = computerDevice && "100%" || "50%";
      rightContainer.style.transition = computerDevice && "width 2s, height 0s, background-color 2s" || "width 0s, height 2s, background-color 2s";
      rightContainer.style.width = computerDevice && "50%" || "100%";
      rightContainer.style.height = computerDevice && "100%" || "50%";
    }, 0);

    leftContainer.classList.toggle("left-loading");
    rightContainer.classList.toggle("right-loading");
    liveCircle.classList.toggle("circle-flash");
    for (let i = 0; i < eventPropertyButtons.length; i++) {
      const eventPropertyButton = eventPropertyButtons[i];

      eventPropertyButton.classList.toggle("event-property-button-flash" + i);
    }
  });
}

function showEventProperties(eventProperty) {
  eventPropertiesVisible = !eventPropertiesVisible;
  visibilityTransitionActive = true;

  eventPropertyButtons.forEach(eventPropertyButton => {
    eventPropertyButton.style["pointer-events"] = "none";
  })

  eventPropertyContainer.classList.toggle("visible-1");

  setTimeout(() => {
    eventPropertyContainer.classList.toggle(computerDevice && "visible-2" || "visible-2-mobile");

    setTimeout(() => {
      updateEventProperty(eventProperty);

      eventPropertyHeading.classList.toggle("text-hidden");
      eventPropertyDescription.classList.toggle("text-hidden");
      
      if (eventProperty == "schedule") {
        eventPropertyContainer.style.height = "auto";
      }

      eventPropertyButtons.forEach(eventPropertyButton => {
        eventPropertyButton.style["pointer-events"] = "auto";
      })

      setTimeout(() => {visibilityTransitionActive = false}, 1000);
    }, 1000);
  }, 1000);
}

function hideEventProperties() {
  eventPropertiesVisible = !eventPropertiesVisible;
  visibilityTransitionActive = true;
  currentEventPropertyButton = null;

  eventPropertyButtons.forEach(eventPropertyButton => {
    eventPropertyButton.style["pointer-events"] = "none";
  })

  eventPropertyHeading.classList.toggle("text-hidden");
  eventPropertyDescription.classList.toggle("text-hidden");
  
  scheduleContainer.style["transition"] = "padding-top 1s";
  scheduleContainer.style["padding-top"] = "0%";

  setTimeout(() => {
    eventPropertyHeading.innerHTML = "";
    eventPropertyDescription.innerHTML = "";

    eventPropertyContainer.style.removeProperty("height");
    eventPropertyContainer.classList.toggle(computerDevice && "visible-2" || "visible-2-mobile");

    setTimeout(() => {
      eventPropertyContainer.classList.toggle("visible-1");

      eventPropertyButtons.forEach(eventPropertyButton => {
        eventPropertyButton.style["pointer-events"] = "auto";
      });

      setTimeout(() => {visibilityTransitionActive = false}, 1000);
    }, 1000);
  }, 1000);
}

function toggleEventPropertiesVisibility(eventPropertyButton) {
  const eventProperty = eventPropertyButton.className.replace("event-", "").replace("-button", "");

  if (eventPropertiesVisible == false) {
    showEventProperties(eventProperty);
    currentEventPropertyButton = eventPropertyButton;
  } else if (eventPropertyButton == currentEventPropertyButton) {
    hideEventProperties();
  } else {
    updateEventProperty(eventProperty);
    currentEventPropertyButton = eventPropertyButton;
  }
}

function maintainButtonTransitionStyle(eventPropertyButton) {
  if (currentEventPropertyButton) {
    currentEventPropertyButton.style["margin-top"] = "2px";
    currentEventPropertyButton.style["border-bottom-width"] = "2px";
  }

  eventPropertyButton.style["margin-top"] = currentEventPropertyButton != eventPropertyButton && "0px" || "2px";
  eventPropertyButton.style["border-bottom-width"] = currentEventPropertyButton != eventPropertyButton && "4px" || "2px";
}

function handleEventPropertyButton(eventPropertyButton) {
  eventPropertyButton.classList.toggle("event-property-button-loading");

  function onEventPropertyButtonClick() {
    if (visibilityTransitionActive == false) {
      maintainButtonTransitionStyle(eventPropertyButton);
      toggleEventPropertiesVisibility(eventPropertyButton);
    }
  }
  
  eventPropertyButton.addEventListener("mousedown", onEventPropertyButtonClick);
}

retrieveAndUseData(url);