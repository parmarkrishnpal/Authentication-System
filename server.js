require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const db = require("./db/conn");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cookieParser = require("cookie-parser");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Authentication System",
      version: "1.0.0",
      description:
        "A simple register-login page which authenticate users with JWT",
    },
    servers: [
      {
        url: "http://localhost:5003",
        description: "Main server",
      },
    ],
  },
  apis: ["server.js"],
};

const specs = swaggerJsDoc(options);

const app = express();
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());
app.use(cookieParser());

//Importing API's
const login = require("./src/login");
const register = require("./src/register");
const change_password = require("./src/change_password");

//Calling Methods
app.use("/api", register);
app.use("/api", login);
app.use("/api", change_password);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Authentication System
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - user_email
 *         - password
 *       properties:
 *         user_email:
 *           type: string
 *           description: The user_email  which is unique to every user
 *         password:
 *           type: string
 *           description: Password to validate user
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The User was successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       11000:
 *         description: User Email already exists
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The User was successfully logged in.
 */

/**
 * @swagger
 * /api/change-password:
 *   post:
 *     summary: Change password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - old_password
 *               - new_password
 *             properties:
 *               old_password:
 *                 type: string
 *                 description: The current password of the user
 *               new_password:
 *                 type: string
 *                 description: The new password to set for the user
 *     responses:
 *       200:
 *         description: Password Changed Successfully.
 */

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5003;
}
app.listen(port, () => {
  console.log("Server started successfully on port: ", port);
});
