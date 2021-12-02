const express = require('express');
const router  = express.Router();


const getOrders = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM restaurant_order;`)
      .then(data => {
        const restaurantOrder = data.rows;
        res.json({ restaurantOrder });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

const sendOrder = (db) => {
  router.post("/", (req, res) => {
    const orderId  = req.session.orderId;
    const readyOrder = () => {
      db.query(`UPDATE restaurant_order
        SET is_ready = TRUE 
        WHERE id = ${orderId};`)
        .catch(err => {
          console.log(err);
        });
    };

    // this will simulate a restaurant receiving an order and make it ready in
    // 5 seconds
    setTimeout(() => {
      readyOrder();

      // We can implement the SMS text message functionality below this comment

    },
    5000
    );
  });
  return router;
};

const getOrderStatus = (db) => {
  router.get("/status", (req, res) => {
    const orderId  = req.session.orderId;
    
    db.query(`SELECT * FROM restaurant_order WHERE id = ${orderId};`)
      .then(data => {
        const restaurantOrder = data.rows[0];
        console.log(data);
        res.json(restaurantOrder);
      })
      .catch(err => {
        console.log(err);
      });
  });
  return router;
};

module.exports = {getOrders, sendOrder, getOrderStatus};
