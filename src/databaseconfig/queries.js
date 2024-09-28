// Create user query (already present)
async function createUser(
  name,
  email,
  phone_number,
  password,
  user_type,
  profile_picture
) {
  return {
    text: `INSERT INTO users (name, email, phone_number, password, user_type, profile_picture) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id`,
    values: [name, email, phone_number, password, user_type, profile_picture],
  };
}

// Fetch user by email
async function getUserByEmail(email) {
  return {
    text: `SELECT * FROM users WHERE email = $1`,
    values: [email],
  };
}

// Fetch user by ID
async function getUserById(userId) {
  return {
    text: `SELECT * FROM users WHERE user_id = $1`,
    values: [userId],
  };
}

// Update user by ID
async function updateUserById(
  userId,
  name,
  phone_number,
  user_type,
  profile_picture
) {
  return {
    text: `UPDATE users SET name = $1, phone_number = $2, user_type = $3, profile_picture = $4 WHERE user_id = $5 RETURNING *`,
    values: [name, phone_number, user_type, profile_picture, userId],
  };
}

// Delete user by ID
async function deleteUserById(userId) {
  return {
    text: `DELETE FROM users WHERE user_id = $1 RETURNING *`,
    values: [userId],
  };
}

async function checkEmailExists(email) {
  return {
    text: `SELECT * FROM users WHERE email = $1`,
    values: [email],
  };
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
  deleteUserById,
  checkEmailExists,
};
