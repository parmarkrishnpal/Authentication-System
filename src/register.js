const bcrypt = require("bcryptjs");
const User = require("../db/model/user");
const { validatePassword } = require("../comm_functions/password_validation");
const { validateEmail } = require("../comm_functions/email_validation");

function validateInput(user_email, plainTextPassword) {
  const emailValidationResult = validateEmail(user_email);
  if (emailValidationResult) {
    return emailValidationResult;
  }

  const passwordValidationResult = validatePassword(plainTextPassword);
  if (passwordValidationResult) {
    return passwordValidationResult;
  }

  return null; // No validation errors
}

async function register(req, res) {
  const { user_email, password: plainTextPassword } = req.body;

  const validationError = validateInput(user_email, plainTextPassword);
  if (validationError) {
    return res.status(400).json({
      status: "error",
      error: validationError,
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const createdUser = await User.create({
      user_email,
      password,
    });

    console.log("User created successfully: ", createdUser);
    res.status(200).json({
      status: "ok",
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        error: "You have already registered",
      });
    }
    return res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
}

module.exports = { register };
