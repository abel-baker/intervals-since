// const DateTime = luxon.DateTime;
// const Duration = luxon.Duration;
// const Interval = luxon.Interval;
const visit_start = DateTime.now();


/// INIT

// Check and verify presence of save data items
// On load, verify/check presence of stored data including tick/time data,
// village, villagers.  Create those that don't exist with logical starting values

function retrieveData(cat) {
  if (!window.localStorage.getItem(cat)) return {};

  return JSON.parse(window.localStorage.getItem(cat));
}
const tick_data = retrieveData('tick-data');
// if (tick_data['prior_start']);

// `tick-data
//   - prior_start // 

// village-data
//   - resources incl. wealth, common resources, upgrades
//   - villagers`;


/// TIME

// Check timing.  If this is new time data, no ticks have occurred.
// If we are loading from local-storage, it depends.  Read the last processed
// tick.  Check if there have been any tick-point DateTimes since, get a count.


/// Catch up with ticks since.  Quickly process the usual ticks to make up
// for the interstitial ticks.  They behave mostly like normal.  Build up
// a report of what has happened, such as number of resources collected
// and sold, any notable events.  Allow for some of the simpler events to
// occur, make note of them for the report.  Modal to show the report upon
// login?

// Save all that processed time.


// GUI

// Build the standard GUI.  Enable the UI items to interact, and the items
// that show status.  Don't rewrite the whole page every time--hold those
// elements to update (e.g. weatherSpanEl).


/// BEGIN TICKING

// Offer interactivity for one or more event that occurred during the off-time


// config
const tick = Duration.fromObject({ seconds: 10 });
const base = visit_start.startOf('day'); // DateTime; start of today ('midnight'), for now
const tick_group_length = 4;
// const tick_position_icon = ['brightness-alt-high', 'sun', 'brightness-alt-low', 'moon'];
const tick_position_icon = ['sunrise', 'sun', 'sunset', 'moon']; // temporary way to show off group position

const ticker = new Ticker({ tick: tick, base: base });
Ticker.tick = Duration.fromObject({ seconds: 10 });
Ticker.group_length = 4;

// computed utility values
const time_since_base = Interval.fromDateTimes(base, visit_start).toDuration(); // Duration
const ticks_since_base = Ticker.ticksBetween(base, visit_start);
// const ticks_since_base = Interval.fromDateTimes(base, visit_start).splitBy(tick).length - 1; // number

const tick_group = ticker.tickGroup(visit_start); // number
const tick_position = ticker.tickPosition(visit_start);
// const tick_position = ticks_since_base % tick_group_length; // number; position within a tick group

const ticks_per_day = Duration.fromObject({ hours: 24 }).toMillis() / tick.toMillis(); // number
const tick_groups_per_day = ticks_per_day / tick_group_length; // number

// data from localStorage
let prior_start = DateTime.fromISO(tick_data.prior_start); // DateTime
const ticks_since_prior_visit = Ticker.ticksBetween(prior_start, visit_start);


// tick functions

// ticks (number) between two passed DateTime objects; optional duration override instead of using ticks
function latestTick(time = visit_start) {
  let duration = Interval.fromDateTimes(base, time).toDuration();
  return base.plus(Duration.fromObject({ milliseconds: duration.toMillis() - Math.floor(duration.toMillis() % tick.toMillis()) }))
}


// village data
const village_data = retrieveData('village-data');

let last_interval = DateTime.now();
ticker.last_processed_tick = last_interval;
refresh();

function refresh() {
  let now = DateTime.now();

  let ticks = Ticker.ticksBetween(last_interval, now);
  if (ticks >= 1) {
    runTicks(ticks, true);
    last_interval = latestTick(now);
    saveData('tick-data', { last_processed_tick: last_interval });
  }

  return {
    latest_tick: ticker.latestTick(),
    tick_group: ticker.tickGroup(),
    tick_position: ticker.tickPosition(),
  };
}

if (village_data.villagers) {
  for (let villager in village_data.villagers) {
    let v = new Villager(village_data.villagers[villager]);

    runTicks(ticks_since_prior_visit, false);
    
    village_data.villagers[villager] = v;
    saveData('village-data', village_data);
  }
} else {
  village_data.villagers = { 
    antonio: new Villager({ name: 'Antonio', job: 'farmer' }), 
    mikhail: new Villager({ name: 'Mikhail', job: 'quarrier', wealth: 4, held: 8 })
   };
  saveData('village-data', village_data);
}


function runTicks(count, log) {
  for (let i = 0; i < count; i++) {
    for (let villager in village_data.villagers) {
      let v = new Villager(village_data.villagers[villager]);

      let report = v.completeActivity(v.activity);
      v.activity = v.priority();
      report += `; on to ${v.activity}`;
      // if (log) console.log(report);
      
      // let log = `${v.name} (${v.held}): ${v.activity}`;
      // console.log(log);
      
      village_data.villagers[villager] = v;
      saveData('village-data', village_data);
    }
  }
}


// save functions

// Create/update saved data in localStorage for the "category" string passed; return false if no existing data
function saveData(cat, obj) {
  if (!window.localStorage.getItem(cat)) {
    window.localStorage.setItem(cat, JSON.stringify( {} ));
    return false;
  };

  const existingData = JSON.parse(window.localStorage.getItem(cat));
  if (cat == 'tick-data' && !existingData.firstVisit) {
    existingData.firstVisit = visit_start;
  }

  let merged = {...existingData, ...obj};

  window.localStorage.setItem(cat, JSON.stringify(merged));
  return true;
}

// save-data
if (window.localStorage.getItem('tick-data')) {
  let data = JSON.parse(window.localStorage.getItem('tick-data'));
  prior_start = data['prior-start'] ? DateTime.fromISO(data['prior_start']) : DateTime.now();
  
  saveData('tick-data', { prior_start: visit_start });
  // window.localStorage.setItem('tick-data', JSON.stringify({ prior_start: visit_start }));
} else {
  saveData('tick-data', { prior_start: visit_start });
  // window.localStorage.setItem('tick-data', JSON.stringify({ prior_start: visit_start }));
}


// utility functions

function icon(i) {
    return `<i class="bi bi-${i}"></i>`;
}


// DOM
const mainEl = document.getElementById("main");
const welcomeEl = document.getElementById("welcome");
const currentEl = document.getElementById("current-time");
const iconEl = document.getElementById("weather-icon");
const latestEl = document.getElementById("latest-tick");
const groupEl = document.getElementById("group-position");
const villagersEl = document.getElementById("villagers");

setInterval( function () {
  if (ticker.ticked()) {
    console.log(`Tick!: ${ticker.last_processed_tick}`);
    ticker.last_processed_tick = ticker.latestTick();
  }
  
  refresh();

  iconEl.innerHTML = forecastIcons(tick_position_icon, ticker.tickPosition() % tick_position_icon.length); // `${icon(tick_position_icon[ticker.tickPosition() % tick_position_icon.length])}`;
  latestEl.innerHTML = `${ticker.latestTick().toLocaleString(DateTime.TIME_WITH_SECONDS)}`;
  groupEl.innerHTML = `${ticker.tickGroup()}:${ticker.tickPosition()}`;

  // mainEl.innerHTML = `
  // <p class="text-light">Time now: ${DateTime.now().toLocaleString(DateTime.TIME_WITH_SECONDS)}; Latest tick: ${icon(tick_position_icon[ticker.tickPosition() % tick_position_icon.length])} ${ticker.latestTick().toLocaleString(DateTime.TIME_WITH_SECONDS)}</p>
  // <p class="text-light">Ticks (${ticker.tick.toHuman()}) from start (${base.toLocaleString(DateTime.TIME_WITH_SECONDS)}): ${ticks_since_base}</p>
  // <p class="text-muted small">Tick group (${ticker.tickGroup()} / ${Math.floor(tick_groups_per_day)}), position (${ticker.tickPosition()} / ${tick_group_length}) </p>
  // <p class="text-light">Prior visit started at ${prior_start.toLocaleString(DateTime.TIME_WITH_SECONDS)}, ${ticks_since_prior_visit} ticks between visits`;

  if (village_data.villagers) {
    // clear current villagers pane
    while (villagersEl.firstChild) {
      villagersEl.removeChild(villagersEl.firstChild);
    }

    for (let villager in village_data.villagers) {
      let v = new Villager(village_data.villagers[villager]);
      let vEl = document.createElement("p");

      vEl.id = v.name;
      vEl.innerHTML = `${v}: ${v.activity}, then ${v.priority()}`;

      villagersEl.appendChild(vEl);
    }
  }
}
, 1000);

function dayIcons(iconGroup,current) {
  let out = ``;
  for (let offset = 0; offset <= iconGroup.length; offset++) {
    if (offset == current) out += `${icon(iconGroup[offset])}`
    else out += `<span class="text-muted">${icon(iconGroup[offset])}</span>`;
  }

  return out;
}

function forecastIcons(iconGroup, current) {
  let out = ``;

  for (let offset = -1; offset <= 2; offset++) {
    let shifted = (iconGroup.length + offset + current) % iconGroup.length;
    // if (offset == 0) out += `${icon(iconGroup[offset])}`;
    if (offset == 0) out += `${icon(iconGroup[shifted]+'-fill')}`;
    else out += `<span class="text-muted">${icon(iconGroup[shifted])}</span>`;
  }

  return out;
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