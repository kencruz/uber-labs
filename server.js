// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require("cookie-session");
// SMS text messaging
const sendMessage = require("./send_sms");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

// set up middleware to use encrypted cookies
app.use(
  cookieSession({
    name: process.env.SESSION_NAME,
    keys: [process.env.SESSION_KEY, process.env.SESSION_KEY2],
  })
);

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
const usersRoutes = require("./routes/users");
const restaurantsRoutes = require("./routes/restaurants");
const dishesRoutes = require("./routes/dishes");
const { getOrders, sendOrder, getOrderStatus } = require("./routes/orders");
const {
  addOrderLineItem,
  getAllOrderLineItems,
} = require("./routes/orderLineItems");
const { getCart } = require("./routes/cart");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/restaurants", restaurantsRoutes(db));
app.use("/api/dishes", dishesRoutes(db));
app.use("/api/orders", getOrders(db));
app.use("/api/orders", sendOrder(db));
app.use("/api/orders", getOrderStatus(db));
app.use("/api/orderLineItems", getAllOrderLineItems(db));
app.use("/api/orderLineItems", addOrderLineItem(db));
app.use("/api/cart", getCart(db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// Home page route
app.get("/", (req, res) => {
  // Look for an orderId cookie
  if (!req.session.orderId) {
    console.log("making new orderId");
    db.query(
      `INSERT INTO restaurant_order (user_id, is_ready) VALUES (1, FALSE) RETURNING id;`
    )
      .then((data) => {
        const orderId = data.rows[0].id;
        req.session.orderId = orderId;
        console.log("orderId: ", req.session.orderId);
        res.render("index");
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log("orderId: ", req.session.orderId);
    res.render("index");
  }
});

// restaurant page route
app.get("/restaurant", (req, res) => {
  res.render("restaurant");
});

// restaurant page route
app.post("/restaurant", (req, res) => {
  res.render("restaurant");
});

app.get("/logout", (req, res) => {
  delete req.session.orderId;
  res.redirect("/");
});

app.get("/admin", (req, res) => {
  db.query(
    "SELECT * FROM restaurant_order WHERE restaurant_id = 1 ORDER BY restaurant_order.id;"
  )
    .then((data) => {
      const orders = data.rows;
      //res.json({orders});
      res.render("admin", { orders });
    })
    .catch((err) => res.status(400).send(err));
});

app.post("/ready/:id", (req, res) => {
  const orderId = req.params.id;
  console.log(req.body, req.params);
  db.query(
    `UPDATE restaurant_order
    SET is_ready = TRUE 
    WHERE id = ${orderId};`
  )
    .then(() => {
      // notify customer of order through text
      db.query(
        `SELECT 
          users.name as customer_name,
          users.phone_number as customer_number,
          restaurant.phone_number as restaurant_number
          FROM users
          JOIN restaurant_order ON user_id = users.id
          JOIN restaurant ON restaurant.id = restaurant_id
          WHERE restaurant_order.id = ${orderId}`
      )
        .then((data) => {
          const restaurantNumber = data.rows[0].restaurant_number;
          const customerNumber = data.rows[0].customer_number;

          sendMessage(
            customerNumber,
            `Hey ${data.rows[0].customer_name}, Your order (${orderId}) is ready. Thank you for ordering!`
          );
        })
        .catch((err) =>
          console.log("error texting to customer on order ready: ", err.message)
        );

      // notify customer text END

      res.redirect("/admin");
    })
    .catch((err) => {
      console.log(err.message);
      res.redirect("/admin");
    });
});

app.post("/estimate-time/:id", (req, res) => {
  const orderId = req.params.id;
  const estimatedTime = req.body["est-time"];
  console.log(orderId, estimatedTime);
  db.query(
    `UPDATE restaurant_order
    SET estimated_time = ${estimatedTime} 
    WHERE id = ${orderId};`
  )
    .then(() => {
      res.redirect("/admin");
    })
    .catch((err) => {
      console.log(err.message);
      res.redirect("/admin");
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
