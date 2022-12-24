const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://Subhodip:wb38ac6770@inotebook.ak38h.mongodb.net/test";

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to Mongo Sucessfully");
  });
};

module.exports = connectToMongo;
