
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
    values: [
      name,
      email,
      phone_number,
      password, 
      user_type,
      profile_picture,
    ],
  };
}

module.exports = {
  createUser,
};
