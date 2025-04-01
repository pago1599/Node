const fs = require("fs");

fs.readFile("prodotti.txt", "utf-8", (err, data) => {
  if (err) {
    console.error("Si è verificato un errore", err);
    return;
  }

  console.log("Contenuto del file:", data);
});

console.log("Avvio script");
