import * as calculator from "./modules/calculator.js";
import * as logger from "./modules/logger.js";

const args = process.argv.slice(2);

function main() {
  if (args.length === 0) {
    logger.stampaBenvenuto();
    process.exit(0);
  }
  // otteniamo operazione e numeri
  const operazione = args[0].toLowerCase();
  const numeri = args.slice(1).map(Number);

  if (numeri.some(isNaN)) {
    logger.logErrore(new Error("Gli argomenti devono esssere numeri validi"));
    process.exit(1);
  }

  let risultato;

  try {
    switch (operazione) {
      case "somma":
        if (numeri.length < 2)
          throw new Error("L'operazione richiede almeno due numeri");
        risultato = calculator.somma(numeri[0], numeri[1]);
        break;

      /*  case "sottrazione":
        if (numeri.length < 2)
          throw new Error("L'operazione richiede almeno due numeri");
        risultato = calculator.sottrazione(numeri[0], numeri[1]);
        break;
      case "moltiplicazione":
        if (numeri.length < 2)
          throw new Error("L'operazione richiede almeno due numeri");
        risultato = calculator.moltiplicazione(numeri[0], numeri[1]);
        break;
      case "divisione":
        if (numeri.length < 2)
          throw new Error("L'operazione richiede almeno due numeri");
        risultato = calculator.divisione(numeri[0], numeri[1]);
        break;
      case "potenza":
        if (numeri.length > 1)
          throw new Error("L'operazione richiede solo un numero");
        risultato = calculator.potenza(numeri[0], numeri[1]);
        break;
      case "radice":
        if (numeri.length > 1)
          throw new Error("L'operazione richiede solo un numero");
        risultato = calculator.radiceQuadrata(numeri[0], numeri[1]);
        break;
      case "percentuale":
        if (numeri.length > 1)
          throw new Error("L'operazione richiede solo un numero");
        risultato = calculator.percentuale(numeri[0], numeri[1]);
        break;
      default:
        throw new Error("Operazione non supportata " + operazione); */
    }
  } catch (error) {
    logger.logErrore(error);
    process.exit(1);
  }

  logger.logOperazione(operazione, numeri, risultato);
}

main();
