// Lägg till ditt API-nyckel här
var API_KEY = 'AIzaSyAbt18cQVqvZK0JsnYOSzhyMuiphCJqX-0';

// Identifiera din kalender
var CALENDAR_ID = 'c_d9aaaa6aa5b776b23b57ec82ab49a0b39b34177b8390aa055f926d10033e3648@group.calendar.google.com';

// Funktionsanrop för att hämta veckoschemat
function getWeeklySchedule() {
    var today = new Date();
    var nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    var calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${today.toISOString()}&timeMax=${nextWeek.toISOString()}`;

    fetch(calendarUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var scheduleElement = document.getElementById('schedule');
            if (data.items && data.items.length > 0) {
                var daysOfWeek = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];

                data.items.forEach(function(event) {
                    var start = new Date(event.start.dateTime || event.start.date);
                    var end = new Date(event.end.dateTime || event.end.date);
                    var dayOfWeek = daysOfWeek[start.getDay()];
                    var eventHTML = `<div class="event">
                        <div class="day">${dayOfWeek}</div>
                        <div class="details">
                            <div class="event-title">${event.summary}</div>
                            <div class="event-time">${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}</div>
                        </div>
                    </div>`;
                    scheduleElement.innerHTML += eventHTML;
                });
            } else {
                scheduleElement.innerHTML = 'Inga händelser hittades för den kommande veckan.';
            }
        });
}

// Anropa funktionen när sidan laddas
getWeeklySchedule();

