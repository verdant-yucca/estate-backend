const {mongoose} = require('mongoose');

const estateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  price: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  images: [],
  views: [],
  coords: [],
  target: {
    type: Boolean,
  },
});
module.exports = mongoose.model('estate', estateSchema);
