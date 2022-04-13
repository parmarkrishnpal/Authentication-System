const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

mongoose.connect('mongodb+srv://manik8331:test123@cluster0.c9pcc.mongodb.net/login-app-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Register-Login-JWT",
      version: "1.0.0",
      description: "A simple register-login page which authenticate users with JWT"
    },
    servers: [{
      url: "http://localhost:9999",
      description: "Main server"
    }]
  },
  apis: ["server.js"]
}

const specs = swaggerJsDoc(options)

const app = express()
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
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())

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

app.post('/api/change-password', async (req, res) => {
  const {
    token,
    newpassword: plainTextPassword
  } = req.body

  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res.json({
      status: 'error',
      error: 'Invalid password'
    })
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: 'error',
      error: 'Password too small. Should be atleast 6 characters'
    })
  }

  try {
    const user = jwt.verify(token, JWT_SECRET)

    const _id = user.id

    const password = await bcrypt.hash(plainTextPassword, 10)

    await User.updateOne({
      _id
    }, {
      $set: {
        password
      }
    })
    res.json({
      status: 'ok'
    })
  } catch (error) {
    console.log(error)
    res.json({
      status: 'error',
      error: ';))'
    })
  }
})

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

app.post('/api/login', async (req, res) => {
  const {
    username,
    password
  } = req.body
  const user = await User.findOne({
    username
  }).lean()

  if (!user) {
    return res.json({
      status: 'error',
      error: 'Invalid username/password'
    })
  }

  if (await bcrypt.compare(password, user.password)) {
    // the username, password combination is successful

    const token = jwt.sign({
        id: user._id,
        username: user.username
      },
      JWT_SECRET
    )

    return res.json({
      status: 'ok',
      data: token
    })
  }

  res.json({
    status: 'error',
    error: 'Invalid username/password'
  })
})


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

app.post('/api/register', async (req, res) => {
  const {
    username,
    password: plainTextPassword
  } = req.body

  if (!username || typeof username !== 'string') {
    return res.json({
      status: 'error',
      error: 'Invalid username'
    })
  }

  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res.json({
      status: 'error',
      error: 'Invalid password'
    })
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: 'error',
      error: 'Password too small. Should be atleast 6 characters'
    })
  }

  const password = await bcrypt.hash(plainTextPassword, 10)

  try {
    const response = await User.create({
      username,
      password
    })
    console.log('User created successfully: ', response)
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({
        status: 'error',
        error: 'Username already in use'
      })
    }
    throw error
  }

  res.json({
    status: 'ok'
  })
})

let port = process.env.PORT;
if(port == null || port == ""){
	port = 9999
}
app.listen(port, () => {
  console.log('Server started successfully')
})
