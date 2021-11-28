const express = require('express');
const router  = express.Router();

module.exports = (db) => {
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