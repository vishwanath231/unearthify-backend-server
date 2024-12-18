const mongoose = require("mongoose");

const MongoDbOne = process.env.MONGO_URI

const databaseOne = () => {
  mongoose
    .connect(MongoDbOne, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB database connected");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error.stack);
    });
};

module.exports = databaseOne;
