// const DateTime = luxon.DateTime;
// const Duration = luxon.Duration;
// const Interval = luxon.Interval;
const visit_start = DateTime.now();


// config
const tick = Duration.fromObject({ seconds: 10 });
const base = visit_start.startOf('day'); // DateTime; start of today ('midnight'), for now
const tick_group_length = 4;
const tick_position_icon = ['brightness-alt-high', 'sun', 'brightness-alt-low', 'moon']; // temporary way to show off group position

const tick_data = retrieveData('tick-data');
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
      if (log) console.log(report);
      
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

function retrieveData(cat) {
  if (!window.localStorage.getItem(cat)) return {};

  return JSON.parse(window.localStorage.getItem(cat));
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

setInterval( function () {
  if (ticker.ticked()) {
    console.log(`Tick!: ${ticker.last_processed_tick}`);
    ticker.last_processed_tick = ticker.latestTick();
  }
  // time = refresh();
  refresh();

  mainEl.innerHTML = `
  <p class="text-light">Time now: ${DateTime.now().toLocaleString(DateTime.TIME_WITH_SECONDS)}; Latest tick: ${icon(tick_position_icon[ticker.tickPosition() % tick_position_icon.length])} ${ticker.latestTick().toLocaleString(DateTime.TIME_WITH_SECONDS)}</p>
  <p class="text-light">Ticks (${ticker.tick.toHuman()}) from start (${base.toLocaleString(DateTime.TIME_WITH_SECONDS)}): ${ticks_since_base}</p>
  <p class="text-muted small">Tick group (${ticker.tickGroup()} / ${Math.floor(tick_groups_per_day)}), position (${ticker.tickPosition()} / ${tick_group_length}) </p>
  <p class="text-light">Prior visit started at ${prior_start.toLocaleString(DateTime.TIME_WITH_SECONDS)}, ${ticks_since_prior_visit} ticks between visits`;
}
, 1000);



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