const express = require('express');
const router  = express.Router();

// This will add an orderLineItem with the order_id found
// in the cookie and will return the new data row
const getCart = (db) => {
  router.get("/", (req, res) => {
    const orderId  = req.session.orderId;
    console.log("should get cart at orderID: ", orderId);
    db.query(`SELECT dishes.id, dishes.name, dishes.description, dishes.img, dishes.price, SUM(orderLineItems.quantity) as quantity
FROM orderLineItems
JOIN dishes ON orderLineItems.item_id = dishes.id
WHERE orderLineItems.order_id = ${orderId}
GROUP BY dishes.id, dishes.name;`)
      .then(data => {
        res.json(data.rows);
      }).catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

module.exports = {getCart};
