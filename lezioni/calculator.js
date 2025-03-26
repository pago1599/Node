const args = process.argv.slice(2);

function main() {
  if (args.length === 0) {
    showHelp();
    process.exit(1);
  }

  let operation = "somma";

  let sum = 0;
  const numbers = [];

  for (const arg of args) {
    const num = parseFloat(arg); // se scrivi "a" ti da NaN, se scrivi "3" ti da 3, se scrivi "3.3" ti da 3.3

    if (isNaN(num)) {
      console.log(`Errore: "${arg}" non è un numero valido`);
      process.exit(1);
    }

    numbers.push(num);
    sum += num;
  }

  console.log(`Numeri: ${numbers.join(" + ")}`);
  console.log(`Somma: ${sum}`);
}

function showHelp() {
  console.log("\nCalcolatore avanzato - Utilizzo");
  console.log("  node calculator.js [operazione] numero1 numero2 ...");
  console.log("\nOperazioni disponibili:");
  console.log("somma, moltiplicazione, media, stats");
}

main();
