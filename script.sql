-- CREATE DATABASE IF NOT EXISTS users;

-- Create table 'users'
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(15),
  password VARCHAR(255) NOT NULL,
  user_type VARCHAR(10) CHECK (user_type IN ('Buyer', 'Seller', 'Agent')),
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  profile_picture VARCHAR(255)
);
