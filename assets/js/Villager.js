class Villager {
  constructor(config) {
    ({
      name: this.name,
      job: this.job = 'rancher',
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
    if (this.held >= 10) {
      return 'market';
    }

    return 'gather';
  }

  completeActivity(activity) {
    if (activity == 'idle') {
      console.log(`${this.name} is finished idling`);
    }
    if (activity == 'gather') {
      this.held += 1;
      console.log(`${this.name} is finished gathering (now ${this.held})`);
    }
    if (activity == 'market') {
      this.held -= 4;
      this.wealth += 4;
      console.log(`${this.name} completes market, sells -4 resource (now ${this.held}) for +4 wealth (now ${this.wealth})`);
    }
  }

  // static methods for doing something related to Villagers but not one specific Villager instance

  // Villager.method()
  static method() {  }
}