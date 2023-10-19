// 3f5d5d5d19074758aa8bc1cc81fe9a29

// Funktion för att hämta bussavgångar från Huddinge sjukhus
function getBusDepartures() {
    const apiKey = '';
    const busStopId = '9001'; // Huddinge sjukhus hållplats ID, du kan behöva kontrollera detta
  
    fetch(`https://api.sl.se/api2/realtimedeparturesV4.json?key=${apiKey}&siteid=${busStopId}&timewindow=60`)
      .then(response => response.json())
      .then(data => {
        console.log('Bussavgångar från Huddinge sjukhus:');
        data.ResponseData.Buses.forEach((departure) => {
          console.log(`Linje ${departure.LineNumber}: Avgår om ${departure.DisplayTime}`);
        });
      })
      .catch(error => {
        console.error('Fel vid hämtning av bussavgångar:', error);
      });
  }
  
  // Funktion för att hämta tågavgångar från Flemingsbergs station
  function getTrainDepartures() {
    const apiKey = '3f5d5d5d19074758aa8bc1cc81fe9a29';
    const stationId = '9112'; // Flemingsbergs station ID, du kan behöva kontrollera detta
  
    fetch(`https://api.sl.se/api2/realtimedeparturesV4.json?key=${apiKey}&siteid=${stationId}&timewindow=60`)
      .then(response => response.json())
      .then(data => {
        console.log('Tågavgångar från Flemingsbergs station:');
        data.ResponseData.Metros.forEach((departure) => {
          console.log(`Linje ${departure.LineNumber}: Avgår om ${departure.DisplayTime}`);
        });
      })
      .catch(error => {
        console.error('Fel vid hämtning av tågavgångar:', error);
      });
  }
  
  // Anropa funktionerna för att hämta avgångar
  getBusDepartures();
  getTrainDepartures();
  



