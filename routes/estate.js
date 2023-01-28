const estateRouter = require('express').Router();
const auth = require("../middlewares/auth");

const {
  estateIdValidation, createEstateValidation,
} = require('../middlewares/validatons');
const {
  createEstate,
  getEstates,
  getEstate,
  updateEstate,
  deleteEstate,
} = require('../controllers/estates');
//createEstateValidation
estateRouter.get('/estate', getEstates);
estateRouter.get('/estate/:estateId', estateIdValidation, getEstate);
estateRouter.use(auth);
estateRouter.post('/estate', createEstateValidation, createEstate);
estateRouter.patch('/estate', updateEstate);
estateRouter.delete('/estate/:estateId', estateIdValidation, deleteEstate);

module.exports = estateRouter;
