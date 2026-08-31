const order = [
  "8455","8467",
  "8442",
  "8456","8470",
  "8444","8446",
  "8458","8461",
  "8448",
  "8472","8475",
  "8465","8462",
  "8451","8477",
  "8452","8466",
  "8441",
  "8454",
  "8443","8468",
  "8457","8469",
  "8445","8459",
  "8473","8447",
  "8476","8474",
  "8449","8463",
  "8460","8450",
  "8464",
  "8478",
  "8453"
];

const grid = document.getElementById("portfolio");
const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewer-image");
const close = document.getElementById("close");


/* ==================================================
   SPALTEN
   ================================================== */

function getColumnCount() {
  return window.innerWidth >= 700 ? 3 : 2;
}


let columns = [];
let currentColumnCount = 0;


function createColumns() {

  const count = getColumnCount();

  if (count === currentColumnCount) {
    return;
  }

  currentColumnCount = count;

  grid.innerHTML = "";
  columns = [];

  for (let i = 0; i < count; i++) {

    const column = document.createElement("div");

    column.className = "portfolio-column";

    grid.appendChild(column);

    columns.push(column);
  }
}


/* ==================================================
   BILDER ERSTELLEN
   ================================================== */

const items = order.map((id, index) => {

  const figure = document.createElement("figure");

  figure.className = "item";

  const img = document.createElement("img");

  img.src = `images/${id}.jpeg`;

  img.alt = `YUNG portfolio image ${index + 1}`;

  /*
    Eager laden, damit beim ersten
    Seitenaufruf nichts nachträglich
    umsortiert wird.
  */
  img.loading = "eager";

  img.decoding = "async";

  figure.appendChild(img);


  /* ================================
     FULLSCREEN
     ================================ */

  figure.addEventListener("click", () => {

    viewerImage.src = img.src;

    viewerImage.alt = img.alt;

    viewer.showModal();

  });


  return {
    id,
    figure,
    img
  };

});


/* ==================================================
   BILDER VORLADEN
   ================================================== */

function waitForImage(img) {

  return new Promise(resolve => {

    if (
      img.complete &&
      img.naturalWidth > 0
    ) {
      resolve();

      return;
    }


    img.addEventListener(
      "load",
      resolve,
      { once: true }
    );


    img.addEventListener(
      "error",
      resolve,
      { once: true }
    );

  });

}


/* ==================================================
   MASONRY
   ================================================== */

async function buildPortfolio() {

  /*
    Erst die richtige Anzahl Spalten erzeugen.
  */

  createColumns();


  /*
    Alle Bilder laden, bevor wir sie verteilen.
    Dadurch bleibt die Reihenfolge stabil.
  */

  await Promise.all(
    items.map(item =>
      waitForImage(item.img)
    )
  );


  /*
    Falls während des Ladens die Fensterbreite
    geändert wurde, Spalten neu bestimmen.
  */

  createColumns();


  const columnHeights =
    new Array(columns.length).fill(0);


  /*
    Desktop:
    8453 ist das letzte Bild und wird
    auf Desktop absichtlich nicht gezeigt.

    Mobile:
    8453 bleibt drin.
  */

  const isDesktop =
    window.innerWidth >= 700;


  const visibleItems =
    isDesktop
      ? items.filter(item => item.id !== "8453")
      : items;


  /*
    Jedes Bild kommt immer in
    die aktuell kürzeste Spalte.
  */

  visibleItems.forEach(item => {

    const ratio =
      item.img.naturalHeight /
      item.img.naturalWidth;


    const columnWidth =
      grid.clientWidth /
      columns.length;


    const height =
      columnWidth * ratio;


    let shortest = 0;


    for (
      let i = 1;
      i < columnHeights.length;
      i++
    ) {

      if (
        columnHeights[i] <
        columnHeights[shortest]
      ) {
        shortest = i;
      }

    }


    columns[shortest].appendChild(
      item.figure
    );


    columnHeights[shortest] +=
      height;
  });

}


/* ==================================================
   START
   ================================================== */

buildPortfolio();


/* ==================================================
   RESIZE
   ================================================== */

let resizeTimer;

window.addEventListener(
  "resize",
  () => {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {

      /*
        Nur neu bauen, wenn wirklich
        zwischen Mobile und Desktop
        gewechselt wurde.
      */

      const newCount =
        getColumnCount();


      if (
        newCount !== currentColumnCount
      ) {

        buildPortfolio();

      }

    }, 150);

  }
);


/* ==================================================
   FULLSCREEN SCHLIESSEN
   ================================================== */

close.addEventListener(
  "click",
  () => {
    viewer.close();
  }
);


viewer.addEventListener(
  "click",
  event => {

    if (event.target === viewer) {
      viewer.close();
    }

  }
);
