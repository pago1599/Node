// modulo con funzioni di calcolo

export function somma(a, b) {
  return a + b;
}

export function sottrazione(a, b) {
  return a - b;
}

export function moltiplicazione(a, b) {
  return a * b;
}

export function divisione(a, b) {
  if (b === 0) {
    throw new Error("Impossibile dividere per zero!");
  }
  return a / b;
}

export function potenza(base, esponente) {
  return Math.pow(base, esponente);
}

export function radiceQuadrata(numero) {
  if (numero < 0) {
    throw new Error(
      "Impossibile calcolare la radice quadrata di un numero negativo"
    );
  }
  return Math.sqrt(numero);
}

export function percentuale(numero, percentuale) {
  return (numero * percentuale) / 100;
}
