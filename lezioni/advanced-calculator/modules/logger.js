// funzioni di logging

export function logOperazione(operazione, numeri, risultato) {
  const timestamp = new Date().toISOString();
  console.log(
    `[${timestamp}] Operazione: ${operazione}, Numeri: ${numeri.join(
      ", "
    )}, Risultato: ${risultato}`
  );
}

export function logErrore(errore) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Errore: ${errore.message}`);
}

export function stampaBenvenuto() {
  console.log("===================");
  console.log("FS33 CALCULATOR");
  console.log("===================");
  console.log("Operazioni disponibili:");
  console.log("    somma                - Somma due numeri");
  console.log("    sottrazione          - Sottrae due numeri");
  console.log("    moltiplicazione      - Moltiplica due numeri");
  console.log("    divisione            - Divide due numeri");
  console.log("    potenza              - Fa la potenza di un numero");
  console.log("    radice               - Calcola la radice di un numero");
  console.log("    percentuale          - Calcola la percentuale di un numero");
  console.log("\n ===================");
  console.log("\n Esempio: node main.js somma 5 3");
}
