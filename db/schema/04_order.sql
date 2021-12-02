DROP TABLE IF EXISTS restaurant_order CASCADE;
CREATE TABLE restaurant_order (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  is_ready BOOLEAN DEFAULT FALSE,
  order_submission TIMESTAMP DEFAULT NOW()
);