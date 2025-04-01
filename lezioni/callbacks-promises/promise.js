const fs = require("fs").promises;

fs.readFile("prodotti.txt", "utf-8")
  .then((data) => {
    console.log("Contenuto del file:", data);
    return data.toUpperCase();
  })
  .then((uppercased) => {
    console.log("Contenuto maiuscolo:", uppercased);
    return fs.writeFile("prodotti_uppercase.txt", uppercased);
  })
  .then(() => {
    console.log("File scritto con successo!");
  })
  .catch((err) => {
    console.error("Si è verificato un errore:", err);
  })
  .finally(() => {
    console.log("Operazioni completate");
  });

console.log("Questa riga viene eseguita prima della lettura del file");
