const images = [
  "8455","8467","8442","8474","8470","8444","8458","8471","8446","8461",
  "8443","8457","8469","8464","8459","8473","8463","8476","8449","8460",
  "8448","8450","8475","8451","8462","8472","8477","8465",
  "8452","8466","8441","8445","8447","8456","8468","8454",
  "8453","8478"
];

const grid = document.getElementById("grid");
const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewerImage");
const close = document.querySelector(".close");

images.forEach((id) => {
  const figure = document.createElement("figure");
  figure.className = "item";

  const img = document.createElement("img");
  img.src = `images/${id}.jpeg`;
  img.alt = `YUNG portfolio image ${id}`;
  img.loading = "lazy";
  img.decoding = "async";

  img.addEventListener("load", () => {
    if (img.naturalWidth >= img.naturalHeight) {
      figure.classList.add("landscape");
    }
  });

  figure.addEventListener("click", () => {
    viewerImage.src = img.src;
    viewerImage.alt = img.alt;
    viewer.showModal();
  });

  figure.appendChild(img);
  grid.appendChild(figure);
});

close.addEventListener("click", () => viewer.close());
viewer.addEventListener("click", (event) => {
  if (event.target === viewer) viewer.close();
});
