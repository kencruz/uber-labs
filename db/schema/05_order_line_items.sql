DROP TABLE IF EXISTS orderLineItems CASCADE;
CREATE TABLE orderLineItems (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1
);
