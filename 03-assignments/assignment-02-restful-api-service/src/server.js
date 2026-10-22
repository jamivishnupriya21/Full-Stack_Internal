const express = require("express");
const app = express();
app.use(express.json());

let books = [{ id: 1, title: "Clean Code", author: "Robert C. Martin", year: 2008 }];
let nextId = 2;

// GET all (supports ?author= filter)
app.get("/books", (req, res) => {
  const { author } = req.query;
  res.json(author ? books.filter((b) => b.author === author) : books);
});

// GET one
app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === +req.params.id);
  book ? res.json(book) : res.status(404).json({ error: "Book not found" });
});

// POST
app.post("/books", (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author) return res.status(400).json({ error: "title and author required" });
  const book = { id: nextId++, title, author, year };
  books.push(book);
  res.status(201).json(book);
});

// PUT
app.put("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === +req.params.id);
  if (!book) return res.status(404).json({ error: "Book not found" });
  Object.assign(book, req.body);
  res.json(book);
});

// DELETE
app.delete("/books/:id", (req, res) => {
  books = books.filter((b) => b.id !== +req.params.id);
  res.sendStatus(204);
});

app.listen(3000, () => console.log("Book API on http://localhost:3000"));
