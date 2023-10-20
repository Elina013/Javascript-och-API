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
