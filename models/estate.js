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
    required: true
  },
  address: {
    type: String,
    required: true
  },
  info: {
    type: String
  },
  createDate: {
    type: Date
  },
  images: [],
  views: [],
  coords: [],
  target: {
    type: Boolean
  },
  typeEstate: {
    type: String
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
  office: {
    floor: {
      type: Number
    },
    square: {
      type: Number
    },
    power_grid_capacity: {
      type: Number
    },
    purpose: {
      type: String
    },
    room_layout: {
      type: String
    },
    heating: {
      type: String
    },
    separate_entrance: {
      type: Boolean
    }
  },
  home: {
    rooms: {
      type: Number
    },
    square: {
      type: Number
    },
    plot_area: {
      type: Number
    },
    house_floors: {
      type: Number
    },
    year_built: {
      type: Number
    },
    land_category: {
      type: String
    },
    wall_material: {
      type: String
    },
    heating: {
      type: String
    },
    toilet: {
      type: String
    },
    Repair: {
      type: String
    },
    water_supply: {
      type: String
    },
    electricity: {
      type: Boolean
    }
  },
});
module.exports = mongoose.model('estate', estateSchema);
