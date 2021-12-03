DROP TABLE IF EXISTS restaurant_order CASCADE;
CREATE TABLE restaurant_order (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  is_ready BOOLEAN DEFAULT FALSE,
  estimated_time INT,
  order_submission TIMESTAMP DEFAULT NOW(),
  restaurant_id INTEGER DEFAULT 1
);
