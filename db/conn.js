const mongoose = require("mongoose");

async function connectToMongoDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://manik8331:SBWIE6btciUDTrdz@cluster0.7nyy8xz.mongodb.net/authentication_system",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(error.message);
  }
}

// Call the function to establish the connection
connectToMongoDB();

// Export the mongoose connection
module.exports = mongoose.connection;
