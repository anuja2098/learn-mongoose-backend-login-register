const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Function to hash the password
async function hashPassword(plainPassword) {
  const saltRounds = 10; // Higher values are more secure but slower

  try {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.error(err);
  }
}

async function verifyPassword(plainPassword, hashedPassword) {
  try {
    // Compare the plain password with the hashed password
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (err) {
    console.error(err);
  }
}

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

// module.exports = {
//   verifyPassword,
//   validateEmail,
// };

module.exports = {
  isValidObjectId,
  hashPassword,
  validateEmail,
  verifyPassword,
};
