const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user"); // Import your User model
// const { JWT_SECRET } = require("./config"); // Import your JWT secret
const JWT_SECRET =
  "sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk";

async function change_password(req, res) {
  const { token, newpassword: plainTextPassword } = req.body;

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({
      status: "error",
      error: "Invalid password",
    });
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters",
    });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);

    const _id = user.id;

    const password = await bcrypt.hash(plainTextPassword, 10);

    await User.updateOne(
      {
        _id,
      },
      {
        $set: {
          password,
        },
      }
    );
    res.json({
      status: "ok",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      error: ";))",
    });
  }
}

module.exports = { change_password };
