const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../db/model/user");
const validateEmail = require("../comm_functions/email_validation");

async function login(req, res) {
  const { user_email, password } = req.body;

  const emailValidationResult = validateEmail(user_email);
  if (emailValidationResult) {
    return res.status(400).json({
      status: "error",
      error: emailValidationResult,
    });
  }

  try {
    const user = await User.findOne({ user_email });

    if (!user) {
      return res.status(401).json({
        status: "error",
        error: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };

      res.cookie("authToken", token, cookieOptions);

      return res.status(200).json({
        status: "success",
        data: token,
      });
    }

    return res.status(401).json({
      status: "error",
      error: "Invalid credentials",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal Server Error"
          : error.message,
    });
  }
}

module.exports = { login };
