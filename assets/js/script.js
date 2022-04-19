const DateTime = luxon.DateTime;
const Duration = luxon.Duration;
const Interval = luxon.Interval;
const visit_start = DateTime.now();


// config
const tick = Duration.fromObject({ seconds: 10 });
const base = visit_start.startOf('day'); // DateTime; start of today ('midnight'), for now
const tick_group_length = 4;
const tick_position_icon = ['brightness-alt-high', 'sun', 'brightness-alt-low', 'moon']; // temporary way to show off group position

const tick_data = retrieveData('tick-data');

// computed utility values
const time_since_base = Interval.fromDateTimes(base, visit_start).toDuration(); // Duration
const ticks_since_base = ticksBetween(base, visit_start);
// const ticks_since_base = Interval.fromDateTimes(base, visit_start).splitBy(tick).length - 1; // number

// latest tick prior to the current visit loaded
const visit_latest_tick = latestTick();
// const visit_latest_tick = base.plus( Duration.fromObject({ milliseconds: time_since_base.toMillis() - Math.floor(time_since_base.toMillis() % tick.toMillis()) }) );

const tick_group = tickGroup(); // number
const tick_position = tickPosition();
// const tick_position = ticks_since_base % tick_group_length; // number; position within a tick group

const ticks_per_day = Duration.fromObject({ hours: 24 }).toMillis() / tick.toMillis(); // number
const tick_groups_per_day = ticks_per_day / tick_group_length; // number

// data from localStorage
let prior_start = DateTime.fromISO(tick_data.prior_start); // DateTime
const ticks_since_prior_visit = ticksBetween(prior_start, visit_start);


// tick functions

// ticks (number) between two passed DateTime objects; optional duration override instead of using ticks
function latestTick(time = visit_start) {
  let duration = Interval.fromDateTimes(base, time).toDuration();
  return base.plus(Duration.fromObject({ milliseconds: duration.toMillis() - Math.floor(duration.toMillis() % tick.toMillis()) }))
}
function tickGroup(time = visit_start) {
  return Math.floor(ticksBetween(base, time) / tick_group_length);
}
function tickPosition(time = visit_start) {
  return ticksBetween(base, time) % tick_group_length;
}
function ticksBetween(first, last, dur = tick) {
  return Interval.fromDateTimes(first, last).splitBy(dur).length - 1;
}

let last_interval = tick_data.last_processed_tick? tick_data.last_processed_tick : DateTime.now();
let time = refresh();

function refresh() {
  let now = DateTime.now();

  let ticks = ticksBetween(last_interval, now);
  if (ticks >= 1) {
    runTicks(ticks);
    last_interval = latestTick(now);
    saveData('tick-data', { last_processed_tick: last_interval });
  }

  return {
    latest_tick: latestTick(now),
    tick_group: tickGroup(now),
    tick_position: tickPosition(now),
  };
}



// village data
const village_data = retrieveData('village-data');

if (village_data.villagers) {
  console.log('Villagers:');
  console.log(village_data.villagers);
  for (let villager in village_data.villagers) {
    let v = new Villager(village_data.villagers[villager]);

    // runTicks(ticks_since_prior_visit, () => giveVillager(v));
    runTicks(ticks_since_prior_visit);

    // let log = `${v.name} (${v.held}): ${v.activity}`;
    // console.log(log);
    
    village_data.villagers[villager] = v;
    saveData('village-data', village_data);
  }
} else {
  console.log('No villagers');

  village_data.villagers = { 
    antonio: new Villager({ name: 'Antonio', job: 'farmer' }), 
    mikhail: new Villager({ name: 'Mikhail', job: 'farmer', wealth: 4, held: 8 })
   };
  saveData('village-data', village_data);
}


function runTicks(count) {
  for (let i = 0; i < count; i++) {
    for (let villager in village_data.villagers) {
      let v = new Villager(village_data.villagers[villager]);

      v.completeActivity(v.activity);
      v.activity = v.priority();
      
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
  time = refresh();

  mainEl.innerHTML = `
  <p class="text-light">Time now: ${DateTime.now().toLocaleString(DateTime.TIME_WITH_SECONDS)}; Latest tick: ${icon(tick_position_icon[time.tick_position % tick_position_icon.length])} ${time.latest_tick.toLocaleString(DateTime.TIME_WITH_SECONDS)}</p>
  <p class="text-light">Ticks (${tick.toHuman()}) from start (${base.toLocaleString(DateTime.TIME_WITH_SECONDS)}): ${ticks_since_base}</p>
  <p class="text-muted small">Tick group (${time.tick_group} / ${Math.floor(tick_groups_per_day)}), position (${time.tick_position} / ${tick_group_length}) </p>
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