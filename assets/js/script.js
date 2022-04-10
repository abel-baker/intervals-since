const DateTime = luxon.DateTime;
const Duration = luxon.Duration;
let now = DateTime.now();

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
function newSaveData(lastTick, visitCount, totalTicks) {
    let saveData = { lastTick: lastTick, visitCount: visitCount, totalTicks: totalTicks,
        firstVisit: now };

    window.localStorage.setItem("tick-data", JSON.stringify(saveData));
}

// Save data object to the data category provided
function saveData(cat, obj) {
    const oldData = JSON.parse(window.localStorage.getItem(cat));
    if (!oldData.firstVisit) oldData.firstVisit = now;

    // Merge with current data so not all properties need to be added every time to the argument object
    let merged = {...oldData, ...obj};

    window.localStorage.setItem(cat, JSON.stringify(merged));
}

// Find the latest third-of-a-minute
function latestTick() {
    return DateTime.now().minus(Duration.fromObject({ seconds: now.second % 20 })); // DateTime
}

const tickData = JSON.parse(window.localStorage.getItem("tick-data"));

// Last visit is the DateTime at the start of the last visit (or the lastest tick, if there isn't one)
let lastVisit = tickData.lastVisit? DateTime.fromISO(tickData.lastVisit) : latestTick(); // DateTime
let lastTick = DateTime.fromISO(tickData.lastTick);

// Readable stuff
let date = lastVisit.toLocaleString(DateTime.DATE_HUGE);
let time = lastVisit.toLocaleString(DateTime.TIME_WITH_SECONDS);
let relative = lastVisit.toRelative();

const lastVisitEl = document.createElement("p");
mainEl.appendChild(lastVisitEl);
lastVisitEl.className = "text-light";
lastVisitEl.textContent = `Your last recorded tick was on ${date} at ${time}, ${relative}.`;

// Get the number of tick-length intervals of time from now to the last recorded visit (data.lastVisit)
const timeSinceLastVisit = luxon.Interval.fromDateTimes(lastVisit, now);
const ticksSinceLastVisit = timeSinceLastVisit.splitBy(tick).length - 1;

lastVisitEl.textContent += `  Since then, ${ticksSinceLastVisit} ticks have elapsed.`;

// Increment number of visits and set the last visit
saveData("tick-data", { lastVisit: now, visitCount: ++tickData.visitCount });

let firstVisit = DateTime.fromISO(tickData.firstVisit);

const timeSinceFirstVisit = luxon.Interval.fromDateTimes(firstVisit, now);
const ticksSinceFirstVisit = timeSinceFirstVisit.splitBy(tick).length - 1;
lastVisitEl.textContent += `  Your first visit was about ${firstVisit.toRelative()}.  That's ${ticksSinceFirstVisit} ticks or so, over ${tickData.visitCount} visits.`;




mainEl.appendChild(villagerCard(angelo));

function saveVillager(villager) {

}

function villagerCard(villager) {
    let cardEl = document.createElement("div");
    cardEl.classList = "card w-10 m-2";
    cardEl.style.display = "inline-block";

    cardEl.innerHTML = `

        <div class="card-body p-1" style="border: 1px solid gray; border-radius: 0.35rem; border-width: 0 0 0 4px;">
            ${villager.name}: ${villager.holding} <span style="color: #F6BB42;">/ ${villager.profession.hold}</span>
        </div>`;

        // <div class="card-header"> 
        //     <i class="bi bi-person-circle"></i> ${villager.name}
        // </div>
        // <div class="card-body">
        //     <i class="bi bi-boxes"></i> ${villager.profession.resource}: ${villager.holding} <span style="color: #F6BB42;">/ ${villager.profession.hold}</span>
        // </div>
        // <div class="card-footer">
        //     ${villager.profession.name}
        // </div>

    return cardEl;
}
