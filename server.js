// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes       = require("./routes/users");
const restaurantsRoutes = require("./routes/restaurants");
const dishesRoutes      = require("./routes/dishes");
const ordersRoutes      = require("./routes/orders");
const orderLineItems    = require("./routes/orderLineItems");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/restaurants", restaurantsRoutes(db));
app.use("/api/dishes", dishesRoutes(db));
app.use("/api/orders", ordersRoutes(db));
app.use("/api/orderLineItems", orderLineItems(db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// Home page route
app.get("/", (req, res) => {
  res.render("index");
});

// Login page route
app.get("/login", (req, res) => {
  res.render("login");
});

// restaurant page route
app.get("/restaurant", (req, res) => {
  res.render("restaurant");
});

// dishes page route
app.get("/dishes", (req, res) => {
  res.render("dishes");
});

// order page route
app.get("/orders", (req, res) => {
  res.render("orders");
});

// Signup page route
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
