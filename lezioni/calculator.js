const args = process.argv.slice(2);

function main() {
  if (args.length === 0) {
    showHelp();
    process.exit(1);
  }

  let operation = "somma";
  let numbers = [...args];

  const validOperations = ["somma", "moltiplicazione", "media", "stats"];
  if (validOperations.includes(args[0].toLowerCase())) {
    operation = args[0].toLowerCase();
    numbers = args.slice(1); // rimuove il primo argomento ovvero l'operazione
  }

  if (numbers.length === 0) {
    console.log("Per favore fornisci dei numeri da calcolare");
    console.log(`Esempio: node calculator.js ${operation} 5 10 15`);
    process.exit(1);
  }

  const parsedNumbers = [];

  for (const num of numbers) {
    const parsedNum = parseFloat(num);

    if (isNaN(parsedNum)) {
      console.log(`Errore: "${num}" non è un numero valido.`);
      process.exit(1);
    }

    parsedNumbers.push(parsedNum);
  }

  // qui faremo lo switch case dove richiamiamo le funzioni delle corrispettive operzioni
  switch (operation) {
    case "somma":
      performSum(parsedNumbers, true);
      break;
    case "moltiplicazione":
      performMult(parsedNumbers, true);
      break;
    case "media":
      performAverage(parsedNumbers, true);
      break;
    case "stats":
      performStats(parsedNumbers, true);
      break;
    default:
      console.log(`Operazione non riconosciuta: ${operation}`);
      showHelp();
      break;
  }
}

function printResults(numbers, result, separator) {
  const stringSeparator = ` ${separator} `;
  console.log(`Numeri: ${numbers.join(stringSeparator)}`);
  console.log(`Risultato operazione: ${result}`);
}

function performSum(numbers, printInfo = false) {
  const sum = numbers.reduce((total, num) => total + num, 0);
  if (printInfo) printResults(numbers, sum, "+");
  return sum;
}

function performMult(numbers, printInfo = false) {
  const mult = numbers.reduce((total, num) => total * num, 1);
  if (printInfo) printResults(numbers, mult, "*");
  return mult;
}

function performAverage(numbers, printInfo = false) {
  const sum = numbers.reduce((total, num) => total + num, 0);
  const average = sum / numbers.length;
  if (printInfo) printResults(numbers, average, ",");
  return average;
}

function performStats(numbers, printInfo = false) {
  // somma
  const sum = performSum(numbers);
  // moltiplicazione
  const mult = performMult(numbers);
  // media
  const average = performAverage(numbers);
  // trovare minimo
  const min = Math.min(...numbers);
  // trovare massimo
  const max = Math.max(...numbers);

  console.log("\n=== STATISTICHE ===");
  console.log(`Numeri: ${numbers.join(", ")}`);
  console.log(`Totale numeri: ${numbers.length}`);
  console.log(`Somma: ${sum}`);
  console.log(`Prodotto: ${mult}`);
  console.log(`Media: ${average}`);
  console.log(`Valore minimo: ${min}`);
  console.log(`Valore massimo: ${max}`);
  console.log(`Range (max-min): ${max - min}`);
}

function showHelp() {
  console.log("\nCalcolatore avanzato - Utilizzo");
  console.log("  node calculator.js [operazione] numero1 numero2 ...");
  console.log("\nOperazioni disponibili:");
  console.log("somma, moltiplicazione, media, stats");
}

main();
