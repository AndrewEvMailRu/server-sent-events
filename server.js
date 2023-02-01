const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3000;
const subscribers = new Map();

const subscribe = (req, res) => {
  res.header({
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    "Retry-After": 120,
    "X-Accel-Buffering": "no",
    "Last-Modified": new Date(),
  });

  res.write("data: Привет\n\n");

  subscribers.set(req, res);

  req.on("close", () => {
    subscribers.delete(req);
  });
};

const publish = (message) => {
  subscribers.forEach((res) => {
    res.write(`data: ${message}\n\n`);
  });
};

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/messages", (req, res) => {
  subscribe(req, res);
});

app.post("/messages", (req, res) => {
  const { message } = req.body;
  publish(message);
  res.send("Success");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
