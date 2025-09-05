const express = require("express");

const app = express();
const port = process.env.PORT || 3001;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});


