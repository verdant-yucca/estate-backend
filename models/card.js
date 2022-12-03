const { mongoose, ObjectId } = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
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
  owner: {
    type: ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [{
    type: ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
