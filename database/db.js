const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const dbconnection = async (message) => {
  try {
    const dbURI = process.env.MONGODB_URL;
    if (!dbURI) {
      throw new Error("MONGODB_URL environment variable is not defined");
    }
    await mongoose.connect(dbURI);
    console.log(`${message}: Database connected`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = dbconnection;
