const express = require("express");
const app = express();

// application-level middleware
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = Date.now();
  next();
});

// route-level middleware
const auth = (req, res, next) => {
  if (req.headers["x-api-key"] !== "secret") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

app.get("/public", (req, res) => res.send("Anyone can see this"));
app.get("/private", auth, (req, res) => res.send("Authorized content"));

// error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(3000);
