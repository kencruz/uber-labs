DROP TABLE IF EXISTS restaurant CASCADE;
CREATE TABLE restaurant (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255) NOT NULL
);
