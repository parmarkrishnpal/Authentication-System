const bcrypt = require("bcryptjs");
const User = require("../db/model/user");
const jwt = require("jsonwebtoken");
const express = require("express");
const auth = require("../comm_functions/auth");
const { validatePassword } = require("../comm_functions/password_validation");

const app = express();
app.post("/api/change-password", auth, async (req, res) => {
  const { old_password, new_password } = req.body;

  try {
    const authToken = req.cookies["authToken"];
    if (!authToken) {
      return res.status(401).json({
        status: "error",
        error: "Unauthorized: You must be logged in to change your password.",
      });
    }

    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
    const user_id = decodedToken.id;

    if (!(old_password && new_password)) {
      return res.status(400).json({
        status: "error",
        error: "All fields are required",
      });
    }

    if (old_password === new_password) {
      return res.status(400).json({
        status: "error",
        error: "Old and new passwords cannot be the same",
      });
    }

    const user = await User.findOne({ _id: user_id });

    if (!user) {
      return res.status(404).json({
        status: "error",
        error: "User details not found",
      });
    }

    const existingPassword = user.password;

    // Check if old_password and existing_password are the same
    const isValid = await bcrypt.compare(old_password, existingPassword);
    if (!isValid) {
      return res.status(401).json({
        status: "error",
        error: "Incorrect credentials",
      });
    }

    const passwordValidationResult = validatePassword(new_password);
    if (passwordValidationResult) {
      return res.status(400).json({
        status: "error",
        error: passwordValidationResult,
      });
    }

    // Encrypt new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    // Update user password
    await User.updateOne({ _id: user_id }, { password: hashedPassword });

    res.json({
      status: "ok",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
});

module.exports = app;
