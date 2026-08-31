/* ==================================================
   BILDREIHENFOLGE
   ================================================== */

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


/* ==================================================
   ELEMENTE
   ================================================== */

const grid = document.getElementById("portfolio");

const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewer-image");
const close = document.getElementById("close");


/* ==================================================
   RESPONSIVE SPALTEN
   ================================================== */

function getColumnCount() {

  /*
    Mobile:
    2 Spalten

    Desktop:
    3 Spalten
  */

  return window.innerWidth >= 700 ? 3 : 2;
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

  img.loading = "eager";

  img.decoding = "async";


  figure.appendChild(img);


  /* =========================
     FULLSCREEN
     ========================= */

  figure.addEventListener("click", () => {

    viewerImage.src = img.src;

    viewerImage.alt = img.alt;

    viewer.showModal();

  });


  return {
    id,
    figure,
    img,
    index
  };

});


/* ==================================================
   AUF BILDER WARTEN
   ================================================== */

const imagePromises = items.map(item => {

  return new Promise(resolve => {

    /*
      Bild ist bereits vollständig geladen.
    */

    if (
      item.img.complete &&
      item.img.naturalWidth > 0
    ) {
      resolve(item);
      return;
    }


    /*
      Normaler Load.
    */

    item.img.addEventListener(
      "load",
      () => resolve(item),
      { once: true }
    );


    /*
      Auch bei einem Fehler weiterbauen,
      damit nicht das komplette Portfolio
      hängen bleibt.
    */

    item.img.addEventListener(
      "error",
      () => resolve(item),
      { once: true }
    );

  });

});


/* ==================================================
   MASONRY AUFBAU
   ================================================== */

function buildMasonry(loadedItems) {

  /*
    Aktuelle Anzahl Spalten bestimmen.
  */

  const columnCount = getColumnCount();


  /*
    Alten Aufbau komplett entfernen.
    Dadurch entstehen beim Wechsel
    zwischen Mobile/Desktop keine
    doppelten Bilder.
  */

  grid.innerHTML = "";


  /*
    Neue Spalten erzeugen.
  */

  const columns = [];

  for (let i = 0; i < columnCount; i++) {

    const column = document.createElement("div");

    column.className = "portfolio-column";

    columns.push(column);

    grid.appendChild(column);

  }


  /*
    Höhe jeder Spalte merken.
  */

  const columnHeights =
    new Array(columnCount).fill(0);


  /*
    Abstände aus CSS.

    Mobile = 3px
    Desktop = 5px
  */

  const gap =
    window.innerWidth >= 700
      ? 5
      : 3;


  /*
    Tatsächliche Breite des Portfolios.
  */

  const gridWidth = grid.clientWidth;


  /*
    Gesamtbreite der Zwischenräume.
  */

  const totalGaps =
    gap * (columnCount - 1);


  /*
    Breite eines einzelnen Bildes.
  */

  const columnWidth =
    (gridWidth - totalGaps) / columnCount;


  /* ==================================================
     BILDER VERTEILEN
     ================================================== */

  loadedItems
  .filter(item => {
    // 8453 nur auf Desktop entfernen
    if (window.innerWidth >= 700 && item.id === "8453") {
      return false;
    }

    return true;
  })
  .forEach(item => {

    /*
      Falls ein Bild nicht geladen werden konnte,
      überspringen wir die Höhenberechnung.
    */

    if (
      !item.img.naturalWidth ||
      !item.img.naturalHeight
    ) {
      return;
    }


    /*
      Seitenverhältnis des Originalbildes.
    */

    const ratio =
      item.img.naturalHeight /
      item.img.naturalWidth;


    /*
      Tatsächliche Höhe in der jeweiligen Spalte.
    */

    const height =
      columnWidth * ratio;


    /*
      Kürzeste Spalte suchen.
    */

    let shortest = 0;

    for (let i = 1; i < columnCount; i++) {

      if (
        columnHeights[i] <
        columnHeights[shortest]
      ) {
        shortest = i;
      }

    }


    /*
      Bild in die kürzeste Spalte setzen.
    */

    columns[shortest].appendChild(
      item.figure
    );


    /*
      Höhe inklusive Abstand merken.
    */

    columnHeights[shortest] +=
      height + gap;

  });

}


/* ==================================================
   INITIALER AUFBAU
   ================================================== */

Promise.all(imagePromises).then(loadedItems => {

  buildMasonry(loadedItems);

});


/* ==================================================
   RESIZE
   ==================================================

   Wenn man beispielsweise das Browserfenster
   von Desktop auf Mobile zieht oder umgekehrt,
   wird das Masonry neu berechnet.
*/

let resizeTimer = null;

window.addEventListener("resize", () => {

  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {

    /*
      Nur neu aufbauen, wenn die Bilder
      bereits geladen sind.
    */

    buildMasonry(items);

  }, 150);

});


/* ==================================================
   FULLSCREEN VIEWER
   ================================================== */

close.addEventListener("click", () => {

  viewer.close();

});


viewer.addEventListener("click", event => {

  if (event.target === viewer) {

    viewer.close();

  }

});
