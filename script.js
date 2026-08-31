/* ==================================================
   YUNG PORTFOLIO
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
  "8478"
  /* 8453 absichtlich entfernt */
];

const grid = document.getElementById("portfolio");

const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewer-image");
const close = document.getElementById("close");


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
    Alle Bilder sofort laden.
    Das verhindert, dass das Layout beim
    ersten Öffnen falsch aufgebaut wird.
  */
  img.loading = "eager";
  img.decoding = "async";

  figure.appendChild(img);

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
   AUF ALLE BILDER WARTEN
   ================================================== */

function waitForImages() {

  return Promise.all(

    items.map(item => {

      if (
        item.img.complete &&
        item.img.naturalWidth > 0
      ) {
        return Promise.resolve(item);
      }

      return new Promise(resolve => {

        item.img.addEventListener(
          "load",
          () => resolve(item),
          { once: true }
        );

        item.img.addEventListener(
          "error",
          () => resolve(item),
          { once: true }
        );

      });

    })

  );

}


/* ==================================================
   MOBILE
   ================================================== */

/*
  Mobile bleibt dein bisheriger Look:

  Zwei echte Spalten.
  Das nächste Bild kommt immer
  in die aktuell kürzere Spalte.
*/

function buildMobile() {

  grid.innerHTML = "";

  const columns = [
    document.createElement("div"),
    document.createElement("div")
  ];

  columns.forEach(column => {
    column.className = "portfolio-column";
    grid.appendChild(column);
  });


  const columnHeights = [0, 0];

  const gap = 3;

  const gridWidth = grid.clientWidth;

  const columnWidth =
    (gridWidth - gap) / 2;


  items.forEach(item => {

    const ratio =
      item.img.naturalHeight /
      item.img.naturalWidth;

    const height =
      columnWidth * ratio;


    const shortest =
      columnHeights[0] <= columnHeights[1]
        ? 0
        : 1;


    columns[shortest].appendChild(
      item.figure
    );


    columnHeights[shortest] +=
      height + gap;

  });

}


/* ==================================================
   DESKTOP
   ================================================== */

/*
  Desktop bekommt KEIN normales Grid.

  Stattdessen werden die Bilder zu Reihen
  zusammengebaut.

  Dadurch können Bilder innerhalb einer Reihe
  unterschiedlich breit sein – genau wie bei
  einer hochwertigen Portfolio-Galerie.
*/

function buildDesktop() {

  grid.innerHTML = "";

  const availableWidth =
    grid.clientWidth;

  const gap = 5;

  /*
    Zielhöhe der Reihen.

    Je größer das Fenster,
    desto größer dürfen die Bilder werden.
  */

  const targetHeight =
    Math.max(
      280,
      Math.min(
        430,
        availableWidth * 0.25
      )
    );


  let row = [];
  let aspectSum = 0;


  function finishRow(isLastRow = false) {

    if (!row.length) return;


    const rowElement =
      document.createElement("div");

    rowElement.className =
      "portfolio-row";


    /*
      Breite, die für Bilder verfügbar ist.
    */

    const totalGap =
      gap * (row.length - 1);

    const imageWidth =
      availableWidth - totalGap;


    /*
      Bei einer normalen Reihe:
      Bilder werden so skaliert,
      dass sie exakt die Reihe füllen.
    */

    let rowHeight =
      imageWidth / aspectSum;


    /*
      Die letzte Reihe soll nicht
      überproportional riesig werden.
    */

    if (isLastRow) {

      rowHeight =
        Math.min(
          rowHeight,
          targetHeight
        );

    }


    row.forEach(item => {

      const ratio =
        item.img.naturalWidth /
        item.img.naturalHeight;

      const width =
        rowHeight * ratio;


      item.figure.style.width =
        `${width}px`;

      item.figure.style.height =
        `${rowHeight}px`;


      rowElement.appendChild(
        item.figure
      );

    });


    grid.appendChild(
      rowElement
    );


    row = [];
    aspectSum = 0;

  }


  /*
    Bilder in Reihen sammeln.
  */

  items.forEach(item => {

    const ratio =
      item.img.naturalWidth /
      item.img.naturalHeight;


    row.push(item);

    aspectSum += ratio;


    const estimatedHeight =
      imageWidthEstimate(
        availableWidth,
        aspectSum,
        row.length,
        gap
      );


    /*
      Sobald die Reihe ungefähr
      die gewünschte Höhe erreicht,
      wird sie abgeschlossen.
    */

    if (
      estimatedHeight <= targetHeight ||
      row.length >= 4
    ) {

      finishRow(false);

    }

  });


  /*
    Restliche Bilder.
  */

  if (row.length) {
    finishRow(true);
  }


  function imageWidthEstimate(
    width,
    aspectRatioSum,
    count,
    gapSize
  ) {

    const gaps =
      gapSize * (count - 1);

    return (
      width - gaps
    ) / aspectRatioSum;

  }

}


/* ==================================================
   LAYOUT AUSWÄHLEN
   ================================================== */

function buildPortfolio() {

  if (
    window.matchMedia(
      "(min-width: 700px)"
    ).matches
  ) {

    buildDesktop();

  } else {

    buildMobile();

  }

}


/* ==================================================
   INITIALISIERUNG
   ================================================== */

waitForImages().then(() => {

  buildPortfolio();

});


/* ==================================================
   RESIZE
   ================================================== */

let resizeTimer;

window.addEventListener(
  "resize",
  () => {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {

      buildPortfolio();

    }, 150);

  }
);


/* ==================================================
   FULLSCREEN VIEWER
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
