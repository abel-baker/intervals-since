const DateTime = luxon.DateTime;
const Duration = luxon.Duration;
const Interval = luxon.Interval;
const visit_start = DateTime.now();

// config
const tick = Duration.fromObject({ seconds: 20 });
const tick_group_length = 4;
const base = visit_start.startOf('day'); // DateTime; start of today ('midnight'), for now

// computed utility values
const time_since_base = Interval.fromDateTimes(base, visit_start).toDuration(); // Duration
const ticks_since_base = Interval.fromDateTimes(base, visit_start).splitBy(tick).length - 1; // number

// latest tick prior to the current visit loaded
const visit_latest_tick = base.plus( Duration.fromObject({ milliseconds: time_since_base.toMillis() - Math.floor(time_since_base.toMillis() % tick.toMillis()) }) );

const tick_group = Math.floor(ticks_since_base / tick_group_length); // number
const tick_position = ticks_since_base % tick_group_length; // number; position within a tick group

const ticks_per_day = Duration.fromObject({ hours: 24 }).toMillis() / tick.toMillis(); // number
const tick_groups_per_day = ticks_per_day / tick_group_length; // number
const tick_position_icon = ['brightness-alt-high', 'sun', 'brightness-alt-low', 'moon']; // temporary way to show off group position


let prior_start = visit_latest_tick;

// save-data
if (window.localStorage.getItem('tick-data')) {
  let data = JSON.parse(window.localStorage.getItem('tick-data'));
  prior_start = DateTime.fromISO(data['prior_start']);
  
  window.localStorage.setItem('tick-data', JSON.stringify({ prior_start: visit_start }));
} else {
  window.localStorage.setItem('tick-data', JSON.stringify({ prior_start: visit_start }));
}


// utility functions

function icon(i) {
    return `<i class="bi bi-${i}"></i>`;
}

// DOM
const mainEl = document.getElementById("main");

mainEl.innerHTML = `
  <p class="text-light">Latest tick: ${icon(tick_position_icon[tick_position % tick_position_icon.length])} ${visit_latest_tick.toLocaleString(DateTime.TIME_WITH_SECONDS)}</p>
  <p class="text-light">Ticks (${tick.toHuman()}) from start (${base.toLocaleString(DateTime.TIME_WITH_SECONDS)}): ${ticks_since_base}</p>
  <p class="text-muted small">Tick group (${tick_group} / ${Math.floor(tick_groups_per_day)}), position (${tick_position} / ${tick_group_length}) </p>
  <p class="text-light">Prior visit started at ${prior_start.toLocaleString(DateTime.TIME_WITH_SECONDS)}`;

// Readable stuff
// let date = lastVisit.toLocaleString(DateTime.DATE_HUGE);
// let time = lastVisit.toLocaleString(DateTime.TIME_WITH_SECONDS);
// let relative = lastVisit.toRelative();

// const lastVisitEl = document.createElement("p");
// mainEl.appendChild(lastVisitEl);

// Get the number of tick-length intervals of time from now to the last recorded visit (data.lastVisit)
// const timeSinceLastVisit = luxon.Interval.fromDateTimes(lastVisit, visit_start);
// const ticksSinceLastVisit = timeSinceLastVisit.splitBy(tick).length - 1;

// lastVisitEl.className = "text-light";
// lastVisitEl.innerHTML = `<p>Your last recorded visit was on ${date} at ${time}, ${relative}.  Since then, ${ticksSinceLastVisit} ticks have elapsed.</p>`;

// saveData("tick-data", { lastVisit: now });

// let firstVisit = DateTime.fromISO(tickData.firstVisit);

// const timeSinceFirstVisit = luxon.Interval.fromDateTimes(firstVisit, visit_start);
// const ticksSinceFirstVisit = timeSinceFirstVisit.splitBy(tick).length - 1;
// lastVisitEl.innerHTML += `<p>You've been here about ${firstVisit.toRelative()} altogether.  That's ${ticksSinceFirstVisit} ticks or so.  Since the beginning, you have visited ${tickData.visitCount} times.</p>`;

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