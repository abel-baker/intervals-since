const DateTime = luxon.DateTime;
const now = DateTime.now();

const tick = luxon.Duration.fromObject({ seconds: 20 });

const mainEl = document.getElementById("main");

const lastVisit = DateTime.fromISO(window.localStorage.getItem("lastVisit"));
if (lastVisit) {
    let lastVisitEl = document.createElement("p");
    lastVisitEl.textContent = lastVisit;
    lastVisitEl.className = "text-light";
    mainEl.append(lastVisitEl);
}

window.localStorage.setItem("lastVisit", now);

const timeSince = luxon.Interval.fromDateTimes(lastVisit, now);
console.log(timeSince.length("seconds"));