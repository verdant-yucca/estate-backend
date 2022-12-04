const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

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
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v),
      message: 'Некорректная ссылка',
    },
  },
  target: {
    type: Boolean,
  },
});
module.exports = mongoose.model('estate', estateSchema);
