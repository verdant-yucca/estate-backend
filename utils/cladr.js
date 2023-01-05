const {options, url, ERROR_BED_REQUEST, ERROR_NOT_FOUND} = require("./constants");
const Estate = require("../models/estate");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

module.exports.cladr = (id, address) => {
  const opt = options(address);
  let coords = [];

  fetch(url, opt)
    .then(response => response.json())
    .then(result => {
      coords = [...coords, result[0].geo_lat, result[0].geo_lon];
      Estate.update({"_id":id}, {"coords": coords})
        .then()
        .catch((err) => {
          if (err.code === ERROR_BED_REQUEST.code) {
            //next(new BadRequestError(ERROR_BED_REQUEST.message));
            throw new BadRequestError(ERROR_BED_REQUEST.message);
          } else {
            console.log('cladr_error ', err);
          }
        });
    })
    .catch(error => console.log("error", error));
}

