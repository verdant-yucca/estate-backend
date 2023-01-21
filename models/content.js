const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  text: {
    type: String,
  },
  image: {
    type: String,
  }
});
module.exports = mongoose.model('content', contentSchema);