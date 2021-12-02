const express = require('express');
const router = express.Router();
const sendMessage = require('../send_sms');


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
    const orderId = req.session.orderId;
    const readyOrder = () => {
      db.query(`UPDATE restaurant_order
        SET is_ready = TRUE 
        WHERE id = ${orderId};`)
        .catch(err => {
          console.log(err.message);
        });
    };

    db.query(`SELECT * FROM users
    JOIN restaurant_order ON user_id = users.id
    WHERE restaurant_order.id = ${orderId}`)
      .then(data => {
        const customerNumber = data.rows[0].phone_number;
        // SMS order has been placed
        sendMessage(customerNumber, `Hey ${data.rows[0].name}, Your order (${orderId}) has been placed.`);

        // this will simulate a restaurant receiving an order and make it ready in
        // 5 seconds
        setTimeout(() => {
          readyOrder();
          // We can implement the SMS text message for when order is ready
          sendMessage(customerNumber, `Hey ${data.rows[0].name}, Your order (${orderId}) is ready. Thank you for ordering!.`);
        },
          5000
        );
      })
      .catch(err => console.log(err.message));
  });
  return router;
};

const getOrderStatus = (db) => {
  router.get("/status", (req, res) => {
    const orderId = req.session.orderId;

    db.query(`SELECT * FROM restaurant_order WHERE id = ${orderId};`)
      .then(data => {
        const restaurantOrder = data.rows[0];
        res.json(restaurantOrder);
      })
      .catch(err => {
        console.log(err.message);
      });
  });
  return router;
};

module.exports = { getOrders, sendOrder, getOrderStatus };
