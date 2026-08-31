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
   ANZAHL SPALTEN
   ================================================== */

const isDesktop = window.innerWidth >= 700;

const columnCount = isDesktop ? 3 : 2;


/* ==================================================
   SPALTEN ERSTELLEN
   ================================================== */

const columns = [];

for (let i = 0; i < columnCount; i++) {

  const column = document.createElement("div");

  column.className = "portfolio-column";

  grid.appendChild(column);

  columns.push(column);
}


/* ==================================================
   BILDER VORBEREITEN
   ================================================== */

const items = order
  .filter(id => !(isDesktop && id === "8453"))
  .map((id, index) => {

    const figure = document.createElement("figure");

    figure.className = "item";


    const img = document.createElement("img");

    img.src = `images/${id}.jpeg`;

    img.alt = `YUNG portfolio image ${index + 1}`;

    img.loading = "eager";

    img.decoding = "async";


    figure.appendChild(img);


    /* ================================================
       FULLSCREEN VIEWER
       ================================================ */

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
   BILDER LADEN
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
   PORTFOLIO AUFBAU
   ================================================== */

async function buildPortfolio() {

  /*
    WICHTIG:

    Wir bauen das Portfolio genau EINMAL.
    Kein Neuaufbau beim Scrollen.
  */

  await Promise.all(
    items.map(item =>
      waitForImage(item.img)
    )
  );


  const columnHeights =
    new Array(columnCount).fill(0);


  /*
    Tatsächliche Breite einer Spalte.
  */

  const gap = isDesktop ? 5 : 3;

  const totalGap =
    gap * (columnCount - 1);

  const columnWidth =
    (grid.clientWidth - totalGap) /
    columnCount;


  /* ==================================================
     MASONRY VERTEILUNG
     ================================================== */

  items.forEach(item => {

    const width =
      item.img.naturalWidth;

    const height =
      item.img.naturalHeight;


    const ratio =
      height / width;


    const renderedHeight =
      columnWidth * ratio;


    /*
      Kürzeste Spalte finden.
    */

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
      renderedHeight + gap;

  });

}


/* ==================================================
   START
   ================================================== */

buildPortfolio();


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
