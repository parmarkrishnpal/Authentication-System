const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../db/model/user");
const JWT_SECRET = process.env.JWT_SECRET;

async function change_password(req, res) {
  const { token, newpassword: plainTextPassword } = req.body;

  // Validate password
  if (
    !plainTextPassword ||
    typeof plainTextPassword !== "string" ||
    plainTextPassword.length < 6
  ) {
    return res.status(400).json({
      status: "error",
      error: "Invalid password. Should be at least 6 characters",
    });
  }

  try {
    // Verify JWT token
    const user = jwt.verify(token, JWT_SECRET);
    const _id = user.id;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(plainTextPassword, 10);

    // Update user password
    await User.updateOne(
      {
        _id,
      },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

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
}

module.exports = { change_password };
