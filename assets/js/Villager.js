class Villager {
  constructor(config) {
    ({
      name: this.name,
      job: this.job = 'rancher',
      inventory: this.inventory = [],
      held: this.held = 0,
      hatched: this.hatched = luxon.DateTime.now().toISO()
    } = config)
  };

  give = function(count = 1) {
    held += count;
    return held;
  }



  // static methods for doing something related to Villagers but not one specific Villager instance

  // Villager.method()
  static method() {  }
}