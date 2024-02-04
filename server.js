const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const db = require("./db/conn");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc"); 

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Register-Login-JWT",
      version: "1.0.0",
      description:
        "A simple register-login page which authenticate users with JWT",
    },
    servers: [
      {
        url: "http://localhost:9999",
        description: "Main server",
      },
    ],
  },
  apis: ["server.js"],
};

const specs = swaggerJsDoc(options);

const app = express();
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         username:
 *           type: string
 *           description: The username  which is unique to every user
 *         password:
 *           type: string
 *           description: Password to validate user
 */
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());

//Importing API's
const { login } = require("./src/login");
const { register } = require("./src/register");
const { change_password } = require("./src/change_password");

//Calling Methods
app.post("/api/register", register);
app.post("/api/login", login);
app.post("/api/change-password", change_password);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Authentication  with JWT
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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Password Changed Successfully.
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
 *         description: Username already exists
 */



let port = process.env.PORT;
if (port == null || port == "") {
  port = 9999;
}
app.listen(port, () => {
  console.log("Server started successfully");
});
