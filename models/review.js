const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  text: {
    type: String
  }
});
module.exports = mongoose.model('review', reviewSchema);