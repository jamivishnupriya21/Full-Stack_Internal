const express = require("express");
const app = express();
app.use(express.json());

let items = [{ id: 1, name: "Pen" }];
let nextId = 2;

app.get("/items", (req, res) => res.json(items));

app.post("/items", (req, res) => {
  const item = { id: nextId++, name: req.body.name };
  items.push(item);
  res.status(201).json(item);
});

app.put("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === +req.params.id);
  if (!item) return res.sendStatus(404);
  item.name = req.body.name;
  res.json(item);
});

app.delete("/items/:id", (req, res) => {
  items = items.filter((i) => i.id !== +req.params.id);
  res.sendStatus(204);
});

app.listen(3000, () => console.log("CRUD API on 3000"));
