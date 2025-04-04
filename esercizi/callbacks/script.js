/* Create a script that uses the Node.js core fs.writeFile() (callback API) method to write a text file. The documentation for this method is on the Node.js File system page. */

import { writeFile } from "node:fs";

const data = "Fabio Artudi 25";

writeFile("file.txt", data, "utf-8", (error) => {
  if (error) {
    console.error("Si è verificato un errore:", error);
    return;
  }
  console.log("Contenuto del file:", data);
});

console.log("Avvio script...");
