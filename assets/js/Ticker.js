const DateTime = luxon.DateTime;
const Duration = luxon.Duration;
const Interval = luxon.Interval;

class Ticker {
  constructor(obj) {
    // Deconstruct passed object
    ({
      tick: this.tick,
      base: this.base // DateTime
    } = obj);

  }

  static tick;

  latestTick(readable = true, time = DateTime.now()) {
    let duration = Interval.fromDateTimes(this.base, time).toDuration();
    let offset = Duration.fromObject({ milliseconds: duration.toMillis() - Math.floor(duration.toMillis() % this.tick.toMillis() )});
    let out = this.base.plus(offset);
    return out;
  }
  tickPosition(time = DateTime.now()) {
    return Ticker.ticksBetween(this.base, time) % Ticker.group_length;
  }
  tickGroup(time = DateTime.now()) {
    return Math.floor(Ticker.ticksBetween(this.base, time) / Ticker.group_length);
  }

  static ticksBetween(first, last) { 
    return Interval.fromDateTimes(first, last).splitBy(Ticker.tick).length - 1;
  }
  static tickGroup(time) {
    return Math.floor(Ticker.ticksBetween(base, time) / Ticker.group_length);
  }

  // Returns whether there is a tick between the last processed tick and the latest one
  // Does not process anything, just reveals whether there is one to be dealt with
  ticked() {
    console.log(this.last_processed_tick);
    return Ticker.ticksBetween(this.last_processed_tick, this.latestTick()) >= 1;
  }

  ticksSince(prior) {

  }
}