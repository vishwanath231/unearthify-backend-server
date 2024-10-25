const mongoose = require("mongoose");

const MongoDbOne = "mongodb://localhost:27017/bliss";

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
