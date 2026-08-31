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
   ZWEI SPALTEN
   ================================================== */

const columns = [
  document.createElement("div"),
  document.createElement("div")
];

columns.forEach(column => {
  column.className = "portfolio-column";
  grid.appendChild(column);
});


/* ==================================================
   DESKTOP ERKENNEN
   ================================================== */

const isDesktop = window.matchMedia("(min-width: 700px)").matches;


/* ==================================================
   BILDER VORBEREITEN
   ================================================== */

const items = order
  .filter(id => {

    /*
      8453 soll nur auf Desktop
      nicht angezeigt werden.
    */

    if (isDesktop && id === "8453") {
      return false;
    }

    return true;
  })
  .map((id, index) => {

    const figure = document.createElement("figure");
    figure.className = "item";

    const img = document.createElement("img");

    img.src = `images/${id}.jpeg`;

    img.alt = `YUNG portfolio image ${index + 1}`;

    /*
      Alle Bilder sofort laden.
      Dadurch wird die Masonry-Anordnung
      beim ersten Seitenaufruf korrekt aufgebaut.
    */
    img.loading = "eager";

    img.decoding = "async";

    figure.appendChild(img);


    /* ==============================================
       BILD ÖFFNEN
       ============================================== */

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

const imagePromises = items.map(item => {

  return new Promise(resolve => {

    /*
      Bild ist bereits geladen
    */
    if (
      item.img.complete &&
      item.img.naturalWidth > 0
    ) {
      resolve(item);
      return;
    }


    /*
      Bild wird noch geladen
    */
    item.img.addEventListener(
      "load",
      () => resolve(item),
      { once: true }
    );


    /*
      Falls ein Bild fehlt,
      trotzdem weitermachen.
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

Promise.all(imagePromises).then(loadedItems => {

  /*
    Sicherheit:
    Spalten vor dem Aufbau leeren.
  */

  columns.forEach(column => {
    column.innerHTML = "";
  });


  const columnHeights = [0, 0];

  const gridWidth = grid.clientWidth;


  /*
    Abstand zwischen den beiden Spalten.
  */

  const gap =
    window.innerWidth >= 700
      ? 5
      : 3;


  const columnWidth =
    (gridWidth - gap) / 2;


  loadedItems.forEach(item => {

    /*
      Falls das Bild nicht geladen werden konnte,
      überspringen.
    */

    if (
      !item.img.naturalWidth ||
      !item.img.naturalHeight
    ) {
      return;
    }


    /*
      Original-Seitenverhältnis
      des Bildes bestimmen.
    */

    const ratio =
      item.img.naturalHeight /
      item.img.naturalWidth;


    /*
      Tatsächliche Höhe in der Spalte.
    */

    const height =
      columnWidth * ratio;


    /*
      Immer die aktuell kürzere
      Spalte auswählen.
    */

    const shortest =
      columnHeights[0] <= columnHeights[1]
        ? 0
        : 1;


    /*
      Bild in die kürzere Spalte setzen.
    */

    columns[shortest].appendChild(
      item.figure
    );


    /*
      Höhe inklusive Spaltenabstand
      aktualisieren.
    */

    columnHeights[shortest] +=
      height + gap;

  });

});


/* ==================================================
   FULLSCREEN VIEWER — SCHLIESSEN
   ================================================== */

close.addEventListener("click", () => {
  viewer.close();
});


/* ==================================================
   FULLSCREEN VIEWER — HINTERGRUND KLICK
   ================================================== */

viewer.addEventListener("click", event => {

  if (event.target === viewer) {
    viewer.close();
  }

});


/* ==================================================
   ESC-TASTE
   ================================================== */

document.addEventListener("keydown", event => {

  if (event.key === "Escape" && viewer.open) {
    viewer.close();
  }

});
