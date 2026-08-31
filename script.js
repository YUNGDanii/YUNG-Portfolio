const order = [
  "8455","8467","8442","8456","8470","8444","8458","8461",
  "8448","8472","8475","8465","8462","8451","8477","8452",
  "8466","8441","8454","8443","8468","8457","8469","8445",
  "8459","8473","8447","8476","8474","8449","8463","8460",
  "8450","8464","8478","8453"
];

const grid = document.getElementById("portfolio");
const viewer = document.getElementById("viewer");
const viewerImage = document.getElementById("viewer-image");
const close = document.getElementById("close");

/*
  Layout:
  Jedes Bild bekommt eine eigene Position.
  So entsteht bewusst dieser versetzte Editorial-Look.
*/

const layouts = [
  { side: "left",  width: 82, offset: 0,  gap: 18 },
  { side: "right", width: 72, offset: 8,  gap: 10 },

  { side: "left",  width: 66, offset: 10, gap: 20 },
  { side: "right", width: 86, offset: 0,  gap: 12 },

  { side: "left",  width: 76, offset: 4,  gap: 22 },
  { side: "right", width: 64, offset: 12, gap: 14 },

  { side: "left",  width: 88, offset: 0,  gap: 18 },
  { side: "right", width: 74, offset: 6,  gap: 24 },

  { side: "left",  width: 68, offset: 8,  gap: 16 },
  { side: "right", width: 82, offset: 0,  gap: 12 },

  { side: "left",  width: 78, offset: 3,  gap: 22 },
  { side: "right", width: 67, offset: 10, gap: 15 },

  { side: "left",  width: 90, offset: 0,  gap: 18 },
  { side: "right", width: 72, offset: 5,  gap: 20 },

  { side: "left",  width: 70, offset: 9,  gap: 15 },
  { side: "right", width: 84, offset: 0,  gap: 22 },

  { side: "left",  width: 80, offset: 2,  gap: 18 },
  { side: "right", width: 66, offset: 11, gap: 15 },

  { side: "left",  width: 87, offset: 0,  gap: 20 },
  { side: "right", width: 74, offset: 6,  gap: 16 },

  { side: "left",  width: 68, offset: 8,  gap: 22 },
  { side: "right", width: 82, offset: 0,  gap: 15 },

  { side: "left",  width: 76, offset: 4,  gap: 20 },
  { side: "right", width: 65, offset: 10, gap: 18 },

  { side: "left",  width: 89, offset: 0,  gap: 16 },
  { side: "right", width: 72, offset: 7,  gap: 22 },

  { side: "left",  width: 67, offset: 9,  gap: 16 },
  { side: "right", width: 84, offset: 0,  gap: 20 },

  { side: "left",  width: 78, offset: 3,  gap: 18 },
  { side: "right", width: 69, offset: 10, gap: 15 },

  { side: "left",  width: 86, offset: 0,  gap: 22 },
  { side: "right", width: 75, offset: 5,  gap: 18 },

  { side: "left",  width: 70, offset: 8,  gap: 20 },
  { side: "right", width: 83, offset: 0,  gap: 16 },

  { side: "left",  width: 80, offset: 2,  gap: 20 },
  { side: "right", width: 68, offset: 11, gap: 18 }
];

order.forEach((id, index) => {
  const figure = document.createElement("figure");
  figure.className = "portfolio-item";

  const layout = layouts[index] || {
    side: index % 2 === 0 ? "left" : "right",
    width: 78,
    offset: 0,
    gap: 18
  };

  figure.style.setProperty("--width", `${layout.width}%`);
  figure.style.setProperty("--offset", `${layout.offset}%`);
  figure.style.setProperty("--gap", `${layout.gap}px`);
  figure.classList.add(layout.side);

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

close.addEventListener("click", () => {
  viewer.close();
});

viewer.addEventListener("click", event => {
  if (event.target === viewer) {
    viewer.close();
  }
});
