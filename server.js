// Require Packeges
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

// Middleweres
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("pages/home");
});

app.listen(port, () => console.log("Server starts on localhost:3000"));
