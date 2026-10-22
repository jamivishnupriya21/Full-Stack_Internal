const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let registrations = [];

app.post("/register", (req, res) => {
    registrations.push(req.body);
    res.json({ message: "Registered successfully" });
});

app.get("/register", (req, res) => {
    res.json(registrations);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});