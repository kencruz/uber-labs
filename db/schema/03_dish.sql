DROP TABLE IF EXISTS dishes CASCADE;
CREATE TABLE dishes (
  id SERIAL PRIMARY KEY,
  restaurant_id INT NOT NULL,

  name VARCHAR(255) NOT NULL,
  description TEXT,
  img VARCHAR(255),
  ingredients TEXT NOT NULL,

  price INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  stock INT NOT NULL DEFAULT 0
);
