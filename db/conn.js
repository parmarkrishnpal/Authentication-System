const mongoose = require("mongoose");

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.conn_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(`Successfully connected to database`);
  } catch (error) {
    console.error(error.message);
  }
}

// Call the function to establish the connection
connectToMongoDB();

// Export the mongoose connection
module.exports = mongoose.connection;
