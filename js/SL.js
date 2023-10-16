// "https://api.sl.se/api2/typeahead.<FORMAT>?key=<DIN NYCKEL>&searchstring=<SÖKORD>&stationsonly=<ENDAST STATIONER>&maxresults<MAX ANTAL SVAR>"
// "https://api.sl.se/api2/realtimedeparturesV4.<FORMAT>?key=<DIN API NYCKEL>&siteid=<SITEID>&timewindow=<TIMEWINDOW>"

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

