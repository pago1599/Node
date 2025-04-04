const users = ["Alice", "Bob", "Charlie", "David"];

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function pickWinner(partecipants) {
  await delay(1000);
  const index = Math.floor(Math.random() * partecipants.length);
  return partecipants[index];
}

async function luckyDraw() {
  console.log("Estrazione in corso...");
  const winner = await pickWinner(users);
  console.log(`Il vincitore è: ${winner}`);
}

luckyDraw();
