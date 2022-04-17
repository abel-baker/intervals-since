const DateTime = luxon.DateTime;
const Duration = luxon.Duration;
const Interval = luxon.Interval;
const visit_start = DateTime.now();

// config
const tick = Duration.fromObject({ seconds: 40 });
const base = visit_start.startOf('day'); // Start of today ('midnight'), for now

const time_since_base = Interval.fromDateTimes(base, visit_start).toDuration();
const ticks_since_base = Interval.fromDateTimes(base, visit_start).splitBy(tick).length - 1;

const latest_tick = base.plus(tick.mapUnits(u => u * ticks_since_base).normalize());



// DOM
const mainEl = document.getElementById("main");

// Readable stuff
let date = lastVisit.toLocaleString(DateTime.DATE_HUGE);
let time = lastVisit.toLocaleString(DateTime.TIME_WITH_SECONDS);
let relative = lastVisit.toRelative();

const lastVisitEl = document.createElement("p");
mainEl.appendChild(lastVisitEl);

// Get the number of tick-length intervals of time from now to the last recorded visit (data.lastVisit)
const timeSinceLastVisit = luxon.Interval.fromDateTimes(lastVisit, visit_start);
const ticksSinceLastVisit = timeSinceLastVisit.splitBy(tick).length - 1;

lastVisitEl.className = "text-light";
lastVisitEl.innerHTML = `<p>Your last recorded visit was on ${date} at ${time}, ${relative}.  Since then, ${ticksSinceLastVisit} ticks have elapsed.</p>`;

// saveData("tick-data", { lastVisit: now });

let firstVisit = DateTime.fromISO(tickData.firstVisit);

const timeSinceFirstVisit = luxon.Interval.fromDateTimes(firstVisit, visit_start);
const ticksSinceFirstVisit = timeSinceFirstVisit.splitBy(tick).length - 1;
lastVisitEl.innerHTML += `<p>You've been here about ${firstVisit.toRelative()} altogether.  That's ${ticksSinceFirstVisit} ticks or so.  Since the beginning, you have visited ${tickData.visitCount} times.</p>`;

// // Update/save time data
// saveData("tick-data", { lastTick: latestTick(), visitCount: ++tickData.visitCount });

// const statusEl = document.createElement("p");
// statusEl.className = "text-light";
// mainEl.appendChild(statusEl);

// let interval = setInterval(function() {
//     let tickData = JSON.parse(window.localStorage.getItem("tick-data"));
//     let lastTick = DateTime.fromISO(tickData.lastTick);
    
//     let date = lastTick.toLocaleString(DateTime.DATE_HUGE);
//     let time = lastTick.toLocaleString(DateTime.TIME_WITH_SECONDS);
//     let relative = lastTick.toRelative();

//     let timeSince = luxon.Interval.fromDateTimes(lastTick, now);
//     let ticksSince = Math.floor(timeSince.length("seconds") / 20);

//     saveData("tick-data", { lastTick: latestTick() });

//     statusEl.textContent = `Active last tick:  ${date} at ${time}, ${relative}`;
// }, 1000)

// function resourceCard(resource, qty, max) {
//     let cardEl = document.createElement("div");
//     cardEl.classList = "card m-4";
//     cardEl.style = "width: 12rem;";

//     let cardBodyEl = document.createElement("div");
//     cardBodyEl.className = "card-body p-0 px-3";

//     let cardHeading = document.createElement("h5");
//     cardHeading.className = "card-title";
//     cardHeading.textContent = resource;

//     let cardText = document.createElement("p");
//     cardText.className = "card-text";
//     cardText.textContent = `${qty} / ${max}`;

//     cardEl.append(cardBodyEl);
//     cardBodyEl.append(cardHeading, cardText);

//     return cardEl;
// }

// mainEl.append(resourceCard("Wood", 2, 5));