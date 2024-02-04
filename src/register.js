const bcrypt = require("bcryptjs");
const User = require("../db/model/user");

function validateInput(username, plainTextPassword) {
  if (!username || typeof username !== "string") {
    return "Invalid username";
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return "Invalid password";
  }

  if (plainTextPassword.length < 6) {
    return "Password too small. Should be at least 6 characters";
  }

  return null; // No validation errors
}

async function register(req, res) {
  const { username, password: plainTextPassword } = req.body;

  const validationError = validateInput(username, plainTextPassword);
  if (validationError) {
    return res.status(400).json({
      status: "error",
      error: validationError,
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const createdUser = await User.create({
      username,
      password,
    });

    console.log("User created successfully: ", createdUser);
    res.status(200).json({
      status: "ok",
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.code === 11000) {
      // duplicate key
      return res.status(400).json({
        status: "error",
        error: "Username already in use",
      });
    }
    return res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
}

module.exports = { register };
