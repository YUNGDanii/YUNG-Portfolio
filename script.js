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
  "8478"
];


const grid = document.getElementById("portfolio");

const viewer = document.getElementById("viewer");

const viewerImage =
  document.getElementById("viewer-image");

const close =
  document.getElementById("close");


/* ==================================================
   MODUS
   ================================================== */

function getMode() {

  return window.innerWidth >= 700
    ? "desktop"
    : "mobile";

}


let currentMode = getMode();

let columns = [];


/* ==================================================
   SPALTEN ERSTELLEN
   ================================================== */

function createColumns() {

  const columnCount =
    currentMode === "desktop"
      ? 3
      : 2;


  grid.innerHTML = "";

  columns = [];


  for (
    let i = 0;
    i < columnCount;
    i++
  ) {

    const column =
      document.createElement("div");

    column.className =
      "portfolio-column";

    grid.appendChild(column);

    columns.push(column);

  }

}


/* ==================================================
   BILDER ERSTELLEN
   ================================================== */

const items = order.map((id, index) => {

  const figure =
    document.createElement("figure");

  figure.className =
    "item";


  const img =
    document.createElement("img");

  img.src =
    `images/${id}.jpeg`;

  img.alt =
    `YUNG portfolio image ${index + 1}`;

  img.loading =
    "eager";

  img.decoding =
    "async";


  figure.appendChild(img);


  /* ==================================================
     FULLSCREEN
     ================================================== */

  figure.addEventListener(
    "click",
    () => {

      viewerImage.src =
        img.src;

      viewerImage.alt =
        img.alt;

      viewer.showModal();

    }
  );


  return {
    id,
    figure,
    img
  };

});


/* ==================================================
   AUF BILD WARTEN
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
   PORTFOLIO AUFBAUEN
   ================================================== */

async function buildPortfolio() {

  createColumns();


  await Promise.all(
    items.map(item =>
      waitForImage(item.img)
    )
  );


  /*
    Falls während des Ladens
    gedreht wurde.
  */

  if (
    getMode() !== currentMode
  ) {

    currentMode =
      getMode();

    await buildPortfolio();

    return;

  }


  const columnCount =
    columns.length;


  const gap =
    currentMode === "desktop"
      ? 5
      : 3;


  const totalGap =
    gap * (columnCount - 1);


  const columnWidth =
    (
      grid.clientWidth -
      totalGap
    ) / columnCount;


  const columnHeights =
    new Array(columnCount)
      .fill(0);


  /* ==================================================
     MASONRY
     ================================================== */

  items.forEach(item => {

    if (
      !item.img.naturalWidth ||
      !item.img.naturalHeight
    ) {

      return;

    }


    const ratio =
      item.img.naturalHeight /
      item.img.naturalWidth;


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
      height + gap;

  });

}


/* ==================================================
   INITIALER AUFBAU
   ================================================== */

buildPortfolio();


/* ==================================================
   DREHEN / RESPONSIVE WECHSEL
   ================================================== */

window.addEventListener(
  "resize",
  () => {

    const newMode =
      getMode();


    /*
      Nur reagieren, wenn wirklich
      Mobile <-> Desktop gewechselt wurde.
    */

    if (
      newMode === currentMode
    ) {

      return;

    }


    /*
      Scrollposition merken.
    */

    const scrollPosition =
      window.scrollY;


    currentMode =
      newMode;


    buildPortfolio().then(() => {

      /*
        Nach dem Wechsel wieder
        an die gleiche Stelle.
      */

      window.scrollTo(
        0,
        scrollPosition
      );

    });

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

    if (
      event.target === viewer
    ) {

      viewer.close();

    }

  }
);
