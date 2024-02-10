const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../db/model/user");

const verifyToken = async (req, res, next) => {
  try {
    // Check if the user is logged in
    if (!req.cookies["authToken"]) {
      return res.status(401).json({
        success: 0,
        msg: "Unauthorized: You must be logged in to access this resource.",
      });
    }

    // Read cookie and check if it's expired
    const token = req.cookies["authToken"];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const verifiedUserId = decoded.id;

      // Check if the user exists is registered
      const checkToken = await User.findOne({
        _id: verifiedUserId,
      });

      if (!checkToken) {
        return res.status(401).json({
          success: 0,
          msg: "Unauthorized: Session not found. Please log in again.",
          isLogout: true,
        });
      }

      // Check token expiration using 'exp' claim
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        res.clearCookie("authToken");
        return res.status(401).json({
          success: 0,
          msg: "Unauthorized: Your session has timed out. Please log in again.",
          isLogout: true,
        });
      }

      // User is authenticated
      next();
    } catch (err) {
      console.error(err);

      if (err.name === "TokenExpiredError") {
        res.clearCookie("authToken");
        return res.status(401).json({
          success: 0,
          msg: "Unauthorized: Your session has timed out. Please log in again.",
          isLogout: true,
        });
      } else {
        return res.status(401).json({
          success: 0,
          msg: "Unauthorized: Invalid authentication token.",
          isLogout: true,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: 0,
      msg: "Internal Server Error: Authentication failed due to an internal server error.",
      isLogout: true,
    });
  }
};

module.exports = verifyToken;
