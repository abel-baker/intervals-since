const DateTime = luxon.DateTime;
const now = DateTime.now();

// config
const tick = luxon.Duration.fromObject({ seconds: 20 });

// DOM
const mainEl = document.getElementById("main");

// data
if (!window.localStorage.getItem("data")) {
    let lastVisit = DateTime.fromISO(window.localStorage.getItem("lastVisit"));
    let visitCount = window.localStorage.getItem("visits");

    let data = { time: { lastVisit: lastVisit },
        stats: { visitCount: visitCount } };

    window.localStorage.setItem("data", JSON.stringify(data));
}

const data = JSON.parse(window.localStorage.getItem("data"));

const lastVisit = DateTime.fromISO(window.localStorage.getItem("lastVisit"));
window.localStorage.setItem("lastVisit", now);
let totalVisits = window.localStorage.getItem("visits") ? window.localStorage.getItem("visits") : 0;
window.localStorage.setItem("visits", ++totalVisits);

const timeSince = luxon.Interval.fromDateTimes(lastVisit, now);

function lastVisitEstimate(timeSince) {
    let lastVisitEl = document.createElement("p");
    lastVisitEl.className = "text-light";

    let date = lastVisit.toLocaleString(DateTime.DATE_HUGE);
    let time = lastVisit.toLocaleString(DateTime.TIME_SIMPLE);
    
    lastVisitEl.textContent = `Your last visit was on ${date} at ${time}, ${lastVisit.toRelative()}/${lastVisit.toRelativeCalendar()}.`;

    mainEl.append(lastVisitEl);

    let estimate = `a little while`;

    if (timeSince.length("hours") > 2) {
        estimate = `about ${Math.floor(timeSince.length("hours"))} hours`;
    } else if (timeSince.length("minutes") > 8) {
        estimate = `about ${Math.floor(timeSince.length("minutes"))} minutes`;
    } else if (timeSince.length("minutes") > 2) {
        estimate = `a few minutes`;
    } else if (timeSince.length("seconds") > 25) {
        estimate = `${Math.floor(timeSince.length("seconds"))} seconds`;
    } else {
        estimate = `not very much time at all`;
    }

    let timeSinceEl = document.createElement("p");
    timeSinceEl.className = "text-light";

    timeSinceEl.textContent = `It has been ${estimate} since your last visit.`;

    mainEl.append(timeSinceEl);

    let ticksSince = timeSince.length("seconds") / 20;
    console.log(`${timeSince.length("seconds")} ${ticksSince} `);

    let tickSinceEl = document.createElement("p");
    tickSinceEl.className = "text-light";

    tickSinceEl.textContent = `The current tick time is ${tick.toHuman()}.  The number of complete ticks since last visit is ${timeSince.splitBy(tick).length -1}.`

    mainEl.append(tickSinceEl);

    let ticksActive = 0;
    let ticksActiveEl = document.createElement("p");
    ticksActiveEl.className = "text-light";

    mainEl.append(ticksActiveEl);

    setInterval(function() {
        ticksActive++;
        ticksActiveEl.textContent = `The number of ticks that have passed since you have been here is ${ticksActive}.`
    }, 20000);
}

lastVisitEstimate(timeSince);

function resourceCard(resource, qty, max) {
    let cardEl = document.createElement("div");
    cardEl.classList = "card m-4";
    cardEl.style = "width: 12rem;";

    let cardBodyEl = document.createElement("div");
    cardBodyEl.className = "card-body p-0 px-3";

    let cardHeading = document.createElement("h5");
    cardHeading.className = "card-title";
    cardHeading.textContent = resource;

    let cardText = document.createElement("p");
    cardText.className = "card-text";
    cardText.textContent = `${qty} / ${max}`;

    cardEl.append(cardBodyEl);
    cardBodyEl.append(cardHeading, cardText);

    return cardEl;
}

mainEl.append(resourceCard("Wood", 2, 5));