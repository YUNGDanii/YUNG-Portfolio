const order = [
  "8455","8467","8442","8456","8470","8444","8446","8458","8461",
  "8448","8472","8475","8465","8462","8451","8477","8452","8466",
  "8441","8454","8443","8468","8457","8469","8445","8459","8473",
  "8447","8476","8474","8449","8463","8460","8450","8464","8478","8453"
];

const fullWidthPositions = new Set([2, 5, 8, 17, 36, 37]);

const grid = document.getElementById("portfolio");
const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewer-image");
const close = document.getElementById("close");

order.forEach((id, index) => {
  const figure = document.createElement("figure");

  figure.className =
    "item" + (fullWidthPositions.has(index) ? " full" : "");

  const img = document.createElement("img");

  img.src = `images/${id}.jpeg`;
  img.alt = `YUNG portfolio image ${index + 1}`;
  img.loading = index < 4 ? "eager" : "lazy";
  img.decoding = "async";

  figure.appendChild(img);
  grid.appendChild(figure);

  figure.addEventListener("click", () => {
    viewerImage.src = img.src;
    viewerImage.alt = img.alt;
    viewer.showModal();
  });
});

close.addEventListener("click", () => viewer.close());

viewer.addEventListener("click", e => {
  if (e.target === viewer) viewer.close();
});
