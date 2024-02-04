const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../db/model/user");
const JWT_SECRET = process.env.JWT_SECRET;

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).lean();

    if (!user) {
      return res.json({
        status: "error",
        error: "Invalid username/password",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        JWT_SECRET
      );

      return res.json({
        status: "ok",
        data: token,
      });
    }

    res.json({
      status: "error",
      error: "Invalid username/password",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
}

module.exports = { login };
