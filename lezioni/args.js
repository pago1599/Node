console.log("Argomenti passati:");

// process.argv contiene il path di node, il path del file e poi tutti gli argomenti
// è un array che viene automaticamente costruito dal runtime di node

process.argv.forEach((val, index) => {
  // console.log(`${index}: ${val}`);
});

const name = process.argv[2];
const surname = process.argv[3];

console.log(`Benvenuto ${name} ${surname}`);
