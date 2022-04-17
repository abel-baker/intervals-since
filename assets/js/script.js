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
const iconData = {
  basic: "square",
  processed: "boxes",

}

const resourceData = {
  produce: {
    type: "basic",
  },
  grain: {
    type: "basic",
  },
  fibers: {
    type: "basic",
  },
  fabrics: {
    type: "processed",
    from: "fibers"
  },
  meats: {
    type: "basic",
  },
  wood: {
    type: "basic",

  },
  stone: {
    type: "basic"
  }
}

// DOM
const mainEl = document.getElementById("main");

for (let resource in resourceData) {
  mainEl.textContent += `${resource}\n`;
}
