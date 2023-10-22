

// 3f5d5d5d19074758aa8bc1cc81fe9a29
async function HämtaData(siteId) {
  let ResponseData = await fetch(`https://api.sl.se/api2/realtimedeparturesV4.json?key=3f5d5d5d19074758aa8bc1cc81fe9a29&siteid=${siteId}&timewindow=15`);
  let data = await ResponseData.json();
  return data.ResponseData.Buses.concat(data.ResponseData.Trains);
}

function SkapaElement(element, textContent, color) {
  let pElement = document.createElement(element);
  pElement.textContent = textContent;
  pElement.style.color = color;
  return pElement;
}

async function VisaTransportInfo() {
  const slInfoContainer = document.getElementById("sl-info");

  const siteIdForBussar = 7000;
  const siteIdForTag = 7006;

  const busAndTrainData = await Promise.all([HämtaData(siteIdForBussar), HämtaData(siteIdForTag)]);

  // Hitta den närmaste tågavgången
  const nearestTrain = busAndTrainData.flat().find(transport => transport.TransportMode === "TRAIN");

  if (nearestTrain) {
    let trainInfoHolder = slInfoContainer.querySelector(".train-info");

    if (!trainInfoHolder) {
      trainInfoHolder = document.createElement("div");
      trainInfoHolder.className = "train-info";
      trainInfoHolder.style.display = "flex";
      trainInfoHolder.style.margin = "1%";
      trainInfoHolder.style.width = "90%";
      trainInfoHolder.style.height = "5vh";
      trainInfoHolder.style.color = "wheat";
      trainInfoHolder.style.border = "solid 1.3px";
      trainInfoHolder.style.borderRadius = "15px";
      trainInfoHolder.style.gap = "10px";
      trainInfoHolder.style.backgroundColor = "#000"; // Bakgrundsfärg

      slInfoContainer.appendChild(trainInfoHolder);
    }

    let lineNumber = SkapaElement("p", nearestTrain.LineNumber, "blue");
    let destination = SkapaElement("p", nearestTrain.Destination, "wheat");
    let displayTime = SkapaElement("p", nearestTrain.DisplayTime, "wheat");
    let stopPointDesignation = SkapaElement("p", `Spår ${nearestTrain.StopPointDesignation}`, "wheat");

    trainInfoHolder.innerHTML = ''; // Rensa innehållet
    trainInfoHolder.appendChild(lineNumber);
    trainInfoHolder.appendChild(destination);
    trainInfoHolder.appendChild(displayTime);
    trainInfoHolder.appendChild(stopPointDesignation);
  } else {
    // Om inga tåg finns, ta bort tåginfo om den tidigare fanns
    const trainInfoHolder = slInfoContainer.querySelector(".train-info");
    if (trainInfoHolder) {
      slInfoContainer.removeChild(trainInfoHolder);
    }
  }

  // Visa blå och röda bussar, totalt 10 bussar och tåg
  const busesAndTrainsToShow = busAndTrainData.flat().filter(transport => transport.TransportMode === "BUS" || transport.TransportMode === "TRAIN").slice(0, 10);

  let busIndex = 0;
  for (const transport of busesAndTrainsToShow) {
    if (busIndex >= 10) {
      break; // Sluta om tio element är nådda
    }

    let infoHolder = slInfoContainer.querySelector(`.bus-info-${busIndex}`);

    if (!infoHolder) {
      infoHolder = document.createElement("div");
      infoHolder.className = `bus-info-${busIndex}`;
      infoHolder.style.display = "flex";
      infoHolder.style.margin = "1%";
      infoHolder.style.width = "90%";
      infoHolder.style.height = "5vh";
      infoHolder.style.color = "wheat";
      infoHolder.style.border = "solid 1.3px";
      infoHolder.style.borderRadius = "15px";
      infoHolder.style.gap = "10px";
      infoHolder.style.backgroundColor = "#000"; // Bakgrundsfärg

      slInfoContainer.appendChild(infoHolder);
    }

    let lineColor = transport.TransportMode === "BUS" ? (transport.LineNumber.startsWith("1") || transport.LineNumber.startsWith("2") ? "blue" : "red") : "blue";
    let lineNumber = SkapaElement("p", transport.LineNumber, lineColor);
    let destination = SkapaElement("p", transport.Destination, "wheat");
    let displayTime = SkapaElement("p", transport.DisplayTime, "wheat");
    let stopPointDesignation = SkapaElement("p", transport.TransportMode === "TRAIN" ? `Spår ${transport.StopPointDesignation}` : `Läge ${transport.StopPointDesignation}`, "wheat");

    infoHolder.innerHTML = ''; // Rensa innehållet
    infoHolder.appendChild(lineNumber);
    infoHolder.appendChild(destination);
    infoHolder.appendChild(displayTime);
    infoHolder.appendChild(stopPointDesignation);

    busIndex++;
  }

  // Ta bort eventuella överblivna info-hållare
  while (slInfoContainer.children.length > busesAndTrainsToShow.length + 1) {
    slInfoContainer.removeChild(slInfoContainer.lastChild);
  }

  // Uppdatera informationen igen om 60 sekunder
  setTimeout(VisaTransportInfo, 60000);
}

// Visa informationen första gången
VisaTransportInfo();


async function VisaVäderData() {
  try {
    const apiKey = "7580324fc9821a21bbb26bd4a0d67d77"; // Byt ut med din faktiska API-nyckel
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Huddinge&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Kunde inte hämta data från API:en");
    }

    const data = await response.json();
    console.log(data);

    for (let i = 0; i < 8; i++) {
      const infoHolder = document.createElement("div");
      const day = document.createElement("h1");
      const temp = document.createElement("p");
      const temp_max = document.createElement("p");
      const temp_min = document.createElement("p");

      const date = new Date();
      date.setDate(date.getDate() + i);

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = days[date.getDay()];

      day.textContent = `${dayName}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      temp.textContent = `${Math.floor(data.list[i].main.temp)}°C`;
      temp_max.textContent = `Max: ${Math.floor(data.list[i].main.temp_max)}°C`;
      temp_min.textContent = `Min: ${Math.floor(data.list[i].main.temp_min)}°C`;

      Väderinformation.appendChild(infoHolder);
      infoHolder.appendChild(day);
      infoHolder.appendChild(temp);
      infoHolder.appendChild(temp_max);
      infoHolder.appendChild(temp_min);
    }
  } catch (error) {
    console.error(error);
  }
}

VisaVäderData();

async function fetchBookReviews() {
  try {
    // Gör en asynkron HTTP-begäran till New York Times API för att hämta bokrecensioner.
    const response = await fetch("https://api.nytimes.com/svc/books/v3/reviews.json?author=Stephen+King&api-key=eMgOCw250nP7GfVOxYQVuXGToz3GzjSy");

    if (!response.ok) {
      throw new Error("Kunde inte hämta data från API:en");
    }

    // Konvertera API-svaret till JSON-format.
    const data = await response.json();

    console.log(data); // Skriv ut API-svaret i konsolen.

    // Loopa igenom och visa högst 10 boktitlar.
    for (let i = 0; i < Math.min(10, data.results.length); i++) {
      const infoHolder = document.createElement("div"); // Skapa en div för att hålla bokinformationen.
      const bookTitle = document.createElement("h1"); // Skapa ett h1-element för boktiteln.

      // Sätt textinnehållet för boktiteln från API-svaret.
      bookTitle.textContent = data.results[i].book_title;

      Bokinformation.appendChild(infoHolder); // Lägg till infoHolder i Bokinformation-elementet på webbsidan.
      infoHolder.appendChild(bookTitle); // Lägg till boktiteln i infoHolder-elementet.
    }
  } catch (error) {
    console.error(error); // Hantera fel om något går fel vid hämtningen av data.
  }
}

fetchBookReviews(); // Anropa funktionen för att hämta och visa bokrecensioner.
