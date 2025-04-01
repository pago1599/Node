import * as fs from "node:fs";

const data = "Ciao";

fs.writeFile("file.txt", data, (error) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(data);
});
