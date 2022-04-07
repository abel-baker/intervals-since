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
    let now = DateTime.now();
    return now.minus(Duration.fromObject({ seconds: now.second % 20 }));
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
let lastTick = DateTime.fromISO(tickData.lastTick);
lastTick = lastTick.minus(Duration.fromObject({ seconds: lastTick.second % 20 }));

// Readable stuff
let date = lastTick.toLocaleString(DateTime.DATE_HUGE);
let time = lastTick.toLocaleString(DateTime.TIME_WITH_SECONDS);
let relative = lastTick.toRelative();

const lastTickEl = document.createElement("p");
lastTickEl.className = "text-light";

mainEl.appendChild(lastTickEl);
lastTickEl.textContent = `Your last recorded tick was on ${date} at ${time}, ${relative}.`;

// Get the number of tick-length intervals of time from now to the last recorded tick (data.lastTick)
const timeSince = luxon.Interval.fromDateTimes(lastTick, now);
let ticksSince = Math.floor(timeSince.length("seconds") / 20);

lastTickEl.textContent += `  Since then, ${ticksSince} ticks have elapsed.
  Since the beginning, you have visited ${tickData.visitCount} times and lived through ${tickData.totalTicks + ticksSince} ticks.`;

// Update/save time data
saveData("tick-data", { lastTick: latestTick(), visitCount: ++tickData.visitCount, totalTicks: tickData.totalTicks + ticksSince });

saveData("resource-data", { woodCount: 4 });

const statusEl = document.createElement("p");
statusEl.className = "text-light";
mainEl.appendChild(statusEl);

let interval = setInterval(function() {
    let tickData = JSON.parse(window.localStorage.getItem("tick-data"));
    let lastTick = DateTime.fromISO(tickData.lastTick);
    
    let date = lastTick.toLocaleString(DateTime.DATE_HUGE);
    let time = lastTick.toLocaleString(DateTime.TIME_WITH_SECONDS);
    let relative = lastTick.toRelative();

    let timeSince = luxon.Interval.fromDateTimes(lastTick, now);
    let ticksSince = Math.floor(timeSince.length("seconds") / 20);

    saveData("tick-data", { lastTick: latestTick(), totalTicks: tickData.totalTicks + ticksSince });

    statusEl.textContent = `Active last tick:  ${date} at ${time}, ${relative}`;
}, 1000)

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