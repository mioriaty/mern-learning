const mongoose = require('mongoose');
require('dotenv').config();

async function connectDb() {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-learning.sle6a.mongodb.net/mern-learning?retryWrites=true&w=majority`, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    console.log('mongodb connected');
  } catch (err) {
    console.log(err.message);
    process.exit(1)
  }
}

module.exports = {
  connectDb
}