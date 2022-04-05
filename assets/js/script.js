const DateTime = luxon.DateTime;
const Duration = luxon.Duration;
const now = DateTime.now();

// config
const tick = Duration.fromObject({ seconds: 20 });

const villagerData = {
    farmer: {
        class: "farmer",
        type: "gatherer",
        resource: "food",
        hold: 10,
        to_market: 0,
        daily_food: 1
    },
    woodcutter: {
        class: "woodcutter",
        type: "gatherer",
        resource: "wood",
        hold: 10,
        to_market: 4,
        daily_food: 1
    },
    quarrier: {
        class: "quarrier",
        type: "gatherer",
        resource: "stone",
        hold: 5,
        to_market: 2,
        daily_food: 1
    }
}
const resourceData = {
    food: {

    },
    wood: {

    },
    stone: {

    }
}

// DOM
const mainEl = document.getElementById("main");

// New visitor data
if (!window.localStorage.getItem("tick-data")) {
    newSaveData(latestTick(), 1, 0);
}

// Find the last third-of-a-minute
function latestTick() {
    return now.minus(Duration.fromObject({ seconds: now.second % 20 }));
}

function newSaveData(lastTick, visitCount, totalTicks) {
    let saveData = { lastTick: lastTick, visitCount: visitCount, totalTicks: totalTicks };

    window.localStorage.setItem("tick-data", JSON.stringify(saveData));
}

function saveData(obj) {
    const oldData = JSON.parse(window.localStorage.getItem("tick-data"));
    console.log(`Previous tick ${DateTime.fromISO(oldData.lastTick)},
        new tick ${latestTick()}`);

    window.localStorage.setItem("tick-data",JSON.stringify(obj));
}

const data = JSON.parse(window.localStorage.getItem("tick-data"));
let lastTick = DateTime.fromISO(data.lastTick);
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
  Since the beginning, you have visited ${data.visitCount} times and lived through ${data.totalTicks + ticksSince} ticks.`;

// Update save data
// saveData(latestTick(), ++data.visitCount, data.totalTicks + ticksSince);
saveData({ lastTick: latestTick(), visitCount: ++data.visitCount, totalTicks: data.totalTicks + ticksSince });

mainEl.appendChild(villagerCard(villagerData.farmer));
mainEl.appendChild(villagerCard(villagerData.farmer));

function villagerCard(villager) {
    let cardEl = document.createElement("div");
    cardEl.classList = "card w-25 m-2";
    cardEl.style.display = "inline-block";

    cardEl.innerHTML = `
        <div class="card-header">
            <i class="bi bi-person"></i> Angelo
        </div>
        <div class="card-body">
            <i class="bi bi-cart"></i> Wood: 9 / 10
        </div>
        <div class="card-footer">
            ${villager.class}
        </div>`;

    return cardEl;
}

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