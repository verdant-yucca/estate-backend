const mongoose = require('mongoose');
//const isBoolean = require("validator/es/lib/isBoolean");

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
  },
  images: [],
  views: [],
  coords: [],
  target: {
    type: Boolean,
  },
  apartment: {
    floor: {
      type: Number
    },
    status: {
      type: String
    },
    rooms: {
      type: Number
    },
    square: {
      type: Number
    },
    kitchen_square: {
      type: Number
    },
    living_space: {
      type: Number
    },
    total_floors: {
      type: Number
    },
    height: {
      type: Number
    },
    bathroom: {
      type: String
    },
    repair: {
      type: String
    },
    furniture: {
      type: String
    },
  },
});
module.exports = mongoose.model('estate', estateSchema);
