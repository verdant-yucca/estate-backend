const {options, url, ERROR_BED_REQUEST} = require("./constants");
const Estate = require("../models/estate");
const BadRequestError = require("../errors/BadRequestError");

module.exports.cladr = (id, address) => {
  const opt = options(address);
  let coords = [];

  fetch(url, opt)
    .then(response => response.json())
    .then(result => {
      coords = [...coords, result[0].geo_lat, result[0].geo_lon];
      Estate.update({"_id":id}, {"coords": coords})
        .then((estate) => res.send({
          estate: {
            title: estate.title,
            price: estate.price,
            images: estate.images,
            coords: estate.coords,
            address: estate.address,
            _id: estate._id,
          },
        }))
        .catch((err) => {
          if (err.code === ERROR_BED_REQUEST.code) {
            next(new BadRequestError(ERROR_BED_REQUEST.message));
          } else {
            next(err);
          }
        });
    })
    .catch(error => console.log("error", error));
}

