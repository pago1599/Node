/* The newsEvent object continuously emits three different events: newsEvent, breakingNews and error

Attach event listeners for each event and log out their data. */

const { EventEmitter } = require("node:events");

function createNewsFeed() {
  const emitter = new EventEmitter();

  setInterval(() => {
    emitter.emit("newsEvent", "News: A thing happened in a place.");
  }, 1000);

  setInterval(() => {
    emitter.emit("breakingNews", "Breaking news! A BIG thing happened.");
  }, 4000);

  setTimeout(() => {
    emitter.emit("error", new Error("News feed connection error"));
  }, 5000);

  return emitter;
}

const newsFeed = createNewsFeed();

newsFeed.on("newsEvent", (data) => {
  console.log(`[News] ${data}`);
});

newsFeed.on("breakingNews", (data) => {
  console.log(`[Breaking] ${data}`);
});

newsFeed.on("error", (err) => {
  console.error(`[Error] ${err.message}`);
});
