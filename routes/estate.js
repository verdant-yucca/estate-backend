const estateRouter = require('express').Router();
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
estateRouter.post('/estate', createEstate);
estateRouter.get('/estate', getEstates);
estateRouter.get('/estate/:estateId', estateIdValidation, getEstate);
estateRouter.patch('/estate', updateEstate);
estateRouter.delete('/estate/:estateId', estateIdValidation, deleteEstate);

module.exports = estateRouter;
