const DateTime = luxon.DateTime;
const Duration = luxon.Duration;
let now = DateTime.now();

const resources = {
    wood: {
        weight: 0.1,
        value: 1
    },
    stone: {
        weight: 0.8,
        value: 2
    }
}
const professions = {
    woodcutter: {
        resource: "wood",
        production: 1,
        base_carry: 10
    },
    stonecutter: {
        resource: "stone",
        production: 1,
        base_carry: 4
    }
}

// config
const tick = Duration.fromObject({ seconds: 20 });

// DOM
const mainEl = document.getElementById("main");

// New visitor data
if (!window.localStorage.getItem("tick-data")) {
    newSaveData(latestTick(), 1, 0);
}

// Find the last third-of-a-minute
function latestTick() {
    return DateTime.now().minus(Duration.fromObject({ seconds: now.second % 20 }));
}

function newSaveData(lastTick, visitCount, totalTicks) {
    let saveData = { lastTick: lastTick, visitCount: visitCount, totalTicks: totalTicks };

    window.localStorage.setItem("tick-data", JSON.stringify(saveData));
}
// Save data object to the data category provided
function saveData(cat, obj) {
    const oldData = JSON.parse(window.localStorage.getItem(cat));

    // Merge with current data so not all properties need to be added every time to the argument object
    let merged = {...oldData, ...obj};

    window.localStorage.setItem(cat, JSON.stringify(merged));
}

const tickData = JSON.parse(window.localStorage.getItem("tick-data"));

// Last visit is the DateTime at the start of the last visit (or the lastest tick, if there isn't one)
let lastVisit = tickData.lastVisit? DateTime.fromISO(tickData.lastVisit) : latestTick(); // DateTime

let lastTick = DateTime.fromISO(tickData.lastTick);
lastTick = lastTick.minus(Duration.fromObject({ seconds: lastTick.second % 20 }));

// Readable stuff
let date = lastVisit.toLocaleString(DateTime.DATE_HUGE);
let time = lastVisit.toLocaleString(DateTime.TIME_WITH_SECONDS);
let relative = lastVisit.toRelative();

const lastVisitEl = document.createElement("p");
mainEl.appendChild(lastVisitEl);
lastVisitEl.className = "text-light";
lastVisitEl.textContent = `Your last recorded tick was on ${date} at ${time}, ${relative}.`;

// Get the number of tick-length intervals of time from now to the last recorded tick (data.lastTick)
const timeSinceLastVisit = luxon.Interval.fromDateTimes(lastVisit, now);
const ticksSinceLastVisit = timeSinceLastVisit.splitBy(tick).length - 1;
console.log(timeSinceLastVisit.splitBy(tick));

saveData("tick-data", { lastVisit: now });

// lastVisitEl.textContent += `  Since then, ${ticksSinceLastVisit} ticks have elapsed.
//   Since the beginning, you have visited ${tickData.visitCount} times and lived through ${tickData.totalTicks + ticksSinceLastVisit} ticks.`;

// // Update/save time data
// saveData("tick-data", { lastTick: latestTick(), visitCount: ++tickData.visitCount, totalTicks: tickData.totalTicks + ticksSinceLastVisit });
// saveData("resource-data", { woodCount: 4 });

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