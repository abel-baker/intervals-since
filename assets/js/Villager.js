const professionData = {
  farmer: {
      class: "farmer",
      type: "gatherer",
      resource: "food",
      resource_value: 1,
      hold: 10,
      to_market: 2,
      daily_food: 1
  },
  woodcutter: {
      class: "woodcutter",
      type: "gatherer",
      resource: "wood",
      resource_value: 2,
      hold: 10,
      to_market: 4,
      daily_food: 1
  },
  quarrier: {
      class: "quarrier",
      type: "gatherer",
      resource: "stone",
      resource_value: 3,
      hold: 5,
      to_market: 4,
      daily_food: 1
  }
}

class Villager {
  constructor(config) {
    ({
      name: this.name,
      job: this.job = 'farmer',
      inventory: this.inventory = [],
      held: this.held = 0,
      wealth: this.wealth = 0,
      activity: this.activity = 'idle',
      hatched: this.hatched = luxon.DateTime.now().toISO()
    } = config)
  }
    
  give(count = 1) {
    this.held += count;
    return this.held;
  }

  priority() {
    if (this.held >= professionData[this.job].hold) {
      return 'market';
    }

    return 'gather';
  }

  toString() {
    return `${this.name} (${this.held} ${professionData[this.job].resource}; ${this.wealth}c)`;
  }

  completeActivity(activity) {
    let jobData = professionData[this.job];
    if (activity == 'idle') {
      return `${this.name} (${this.held} ${jobData.resource}; ${this.wealth}c) is finished idling`;
    }
    if (activity == 'gather') {
      this.held += 1;
      return `${this.name} (${this.held} ${jobData.resource}; ${this.wealth}c) is finished gathering ${jobData.resource}`;
    }
    if (activity == 'market') {
      this.held -= jobData.to_market;
      let sale = jobData.resource_value * jobData.to_market;
      this.wealth += sale;
      return `${this.name} (${this.held} ${jobData.resource}; ${this.wealth}c) completes market, sold -${jobData.to_market} ${jobData.resource} for +${sale}c`;
    }
  }
}
