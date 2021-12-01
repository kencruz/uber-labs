const express = require('express');
const router  = express.Router();

// This will add an orderLineItem with the order_id found
// in the cookie and will return the new data row
const addOrderLineItem = (db) => {
  router.post("/new", (req, res) => {
    const orderId  = req.session.orderId;
    console.log("should post new at orderID: ", orderId);
    const {itemId, quantity} = req.body;
    console.log(itemId, quantity);
    db.query(`INSERT INTO orderLineItems (order_id, item_id, quantity)
      VALUES (${orderId}, ${itemId}, ${quantity}) RETURNING *`)
      .then(data => {
        res.json(data.rows[0]);
      }).catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

// This will return an array of orderLineItems with the order_id found
// in the cookie
const getAllOrderLineItems = (db) => {
  router.get("/", (req, res) => {
    const orderId = req.session.orderId;
    db.query(`SELECT * FROM orderLineItems WHERE order_id = ${orderId};`)
      .then(data => {
        const orderLineItems = data.rows;
        res.json({ orderLineItems });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

module.exports = {addOrderLineItem, getAllOrderLineItems};
