// Require Packeges
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;

// Middleweres
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Database
mongoose.connect(`mongodb://localhost:27017/TodoAuth`);
const db = mongoose.connection;
db.on("error", () => console.log("Error"));
db.on("connected", () => console.log("Database connected"));
// Todo Schema
const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  isCompleted: {
    type: Boolean,
  },
});
const Todos = mongoose.model("Todos", todoSchema);

// Routes
// GET Routes
app.get("/", async (req, res) => {
  const todos = await Todos.find({});
  res.render("pages/home", { todos: todos });
});
app.get("/todo/:id", async (req, res) => {
  const todo = await Todos.findOne({ _id: req.params.id });
  res.render("pages/todo", { todo: todo });
});
app.get("/create", (req, res) => {
  res.render("pages/create");
});
app.get("/edit/:id", async (req, res) => {
  const todo = await Todos.findOne({ _id: req.params.id });
  res.render("pages/edit", { todo: todo });
});
app.get("/completed/:id", async (req, res) => {
  const check = await Todos.findOne({ _id: req.params.id });
  if (!check.iscompleted) {
    await Todos.updateOne({ _id: req.params.id }, { isCompleted: true });
    if (check.isCompleted) {
      await Todos.updateOne({ _id: req.params.id }, { isCompleted: false });
    }
  } else {
    await Todos.updateOne({ _id: req.params.id }, { isCompleted: false });
  }
  res.redirect("/");
});
// Delete
app.get("/delete/:id", async (req, res) => {
  const todo = await Todos.deleteOne({ _id: req.params.id });
  res.redirect("/");
});
// POST Routes
app.post("/create", async (req, res) => {
  const { title, description, isCompleted } = req.body;
  await Todos.create({
    title: title,
    description: description,
    isCompleted: false,
  });
  if (res.statusCode === 200) {
    res.redirect("/");
  } else {
    console.log("error");
  }
});
app.post("/edit/:id", async (req, res) => {
  const { title, description, isCompleted } = req.body;
  await Todos.updateOne(
    { _id: req.params.id },
    {
      title: title,
      description: description,
    }
  );
  if (res.statusCode === 200) {
    res.redirect("/");
  } else {
    console.log("error");
  }
});
app.get("/*", (req, res) => {
  res.render("pages/404");
});

app.listen(port, () => console.log("Server starts on localhost:3000"));
