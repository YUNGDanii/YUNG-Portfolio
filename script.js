const images = [
  "8455",
  "8467",
  "8442",
  "8456",
  "8470",
  "8444",
  "8458",
  "8461",
  "8448",
  "8472",
  "8475",
  "8465",
  "8462",
  "8451",
  "8477",
  "8452",
  "8466",
  "8441",
  "8454",
  "8443",
  "8468",
  "8457",
  "8469",
  "8445",
  "8459",
  "8473",
  "8447",
  "8476",
  "8474",
  "8449",
  "8463",
  "8460",
  "8450",
  "8464",
  "8478",
  "8453"
];

const portfolio = document.getElementById("portfolio");

const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewer-image");
const closeButton = document.getElementById("close");


/* =========================
   PORTFOLIO BILDER
   ========================= */

images.forEach((id, index) => {

  const item = document.createElement("figure");

  item.className = "portfolio-item";

  /*
    Die Positionen werden über CSS-Klassen
    gesteuert.

    Dadurch können wir später jedes Bild
    einzeln verschieben, ohne die
    Bildreihenfolge anzufassen.
  */

  item.classList.add(
    index % 2 === 0 ? "left" : "right"
  );


  const image = document.createElement("img");

  image.src = `images/${id}.jpeg`;

  image.alt = `YUNG Portfolio — Bild ${index + 1}`;

  image.loading = index < 4
    ? "eager"
    : "lazy";

  image.decoding = "async";


  item.appendChild(image);

  portfolio.appendChild(item);


  /* =========================
     FULLSCREEN
     ========================= */

  item.addEventListener("click", () => {

    viewerImage.src = image.src;
    viewerImage.alt = image.alt;

    viewer.showModal();

  });

});


/* =========================
   VIEWER SCHLIESSEN
   ========================= */

closeButton.addEventListener("click", () => {
  viewer.close();
});


viewer.addEventListener("click", event => {

  if (event.target === viewer) {
    viewer.close();
  }

});


document.addEventListener("keydown", event => {

  if (event.key === "Escape" && viewer.open) {
    viewer.close();
  }

});
