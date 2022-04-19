const DateTime = luxon.DateTime;
const Duration = luxon.Duration;
const Interval = luxon.Interval;

class Ticker {
  constructor(obj) {
    // Deconstruct passed object
    ({
      tick: this.tick,
      base: this.base
    } = obj);

  }

  static tick;

  static ticksBetween(first, last) {
    return Interval.fromDateTimes(first, last).splitBy(Ticker.tick).length - 1;
  }
  static tickGroup(time) {
    return Math.floor(Ticker.ticksBetween(base, time) / Ticker.group_length);
  }
  static tickPosition() {
    return Ticker.ticksBetween()
  }

  

  ticksSince(prior) {

  }
}