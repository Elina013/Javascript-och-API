function getDateTime() {
    var currentTime = new Date();

    var day = currentTime.toLocaleDateString(undefined, { weekday: 'short' });
    var date = currentTime.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    var time = currentTime.toLocaleTimeString();

    return {
        day: day, 
        date: date, 
        time: time
    };
}

function updateClock() {
    var datetime = getDateTime();
    var datetimeInfo = document.getElementById("datetime-info");
    datetimeInfo.innerHTML = "Dag: " + datetime.day + "<br>Datum: " + datetime.date + "<br>Tid: " + datetime.time;
}

// Uppdatera tiden varje sekund
setInterval(updateClock, 1000);

// Uppdatera tiden när sidan laddas för första gången
updateClock();

