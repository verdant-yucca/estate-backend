const mongoose = require('mongoose');

const estateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  price: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  photo: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        const regex = /^((http|https):\/\/)?(www\.)?([a-zа-я0-9]{1}[a-zа-я0-9-\\]*\.?)*\.{1}[a-zа-я0-9-]{2,8}(\w-\.~:\/?#\[\]@!$&'\(\)*\+,;=)?/gi;
        return regex.test(v);
      },
      message: 'Некорректная ссылка',
    },
  },
  description: {
    type: String,
    minlength: 2,
    maxlength: 200,
  }
});

module.exports = mongoose.model('estate', estateSchema);
