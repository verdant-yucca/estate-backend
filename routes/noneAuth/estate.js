const estateRouter = require('express').Router();

const {estateIdValidation} = require('../../middlewares/validatons');
const {
  getEstates,
  getEstate,
} = require('../../controllers/estates');
estateRouter.get('/estate', getEstates);
estateRouter.get('/estate/:estateId', estateIdValidation, getEstate);

module.exports = estateRouter;
