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

const columns = [
  document.createElement("div"),
  document.createElement("div")
];

columns.forEach(column => {
  column.className = "portfolio-column";
  grid.appendChild(column);
});


/* ==================================================
   BILDER VORBEREITEN
   ================================================== */

const items = order.map((id, index) => {

  const figure = document.createElement("figure");
  figure.className = "item";

  const img = document.createElement("img");

  img.src = `images/${id}.jpeg`;

  img.alt = `YUNG portfolio image ${index + 1}`;

  img.decoding = "async";

  /*
    Wichtig:
    Keine Lazy-Loads während des initialen
    Masonry-Aufbaus.
  */
  img.loading = "eager";

  figure.appendChild(img);

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
   ALLE BILDER LADEN
   ================================================== */

const imagePromises = items.map(item => {

  return new Promise(resolve => {

    if (item.img.complete && item.img.naturalWidth > 0) {
      resolve(item);
      return;
    }

    item.img.addEventListener("load", () => {
      resolve(item);
    }, { once: true });

    item.img.addEventListener("error", () => {
      resolve(item);
    }, { once: true });

  });

});


/* ==================================================
   MASONRY AUFBAUEN
   ================================================== */

Promise.all(imagePromises).then(loadedItems => {

  const columnHeights = [0, 0];

  const gridWidth = grid.clientWidth;

  const columnWidth =
    (gridWidth - 3) / 2;


  loadedItems.forEach(item => {

    const ratio =
      item.img.naturalHeight /
      item.img.naturalWidth;

    const height =
      columnWidth * ratio;


    /*
      Immer die aktuell kürzere
      Spalte nehmen.
    */

    const shortest =
      columnHeights[0] <= columnHeights[1]
        ? 0
        : 1;


    columns[shortest].appendChild(item.figure);

    columnHeights[shortest] += height + 3;

  });

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
