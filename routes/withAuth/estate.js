const estateRouter = require('express').Router();
const {estateIdValidation, createEstateValidation} = require('../../middlewares/validatons');
const {
  createEstate,
  updateEstate,
  deleteEstate,
} = require('../../controllers/estates');

estateRouter.post('/estate', createEstate); //createEstateValidation, 
estateRouter.patch('/estate', updateEstate);
estateRouter.delete('/estate/:estateId', estateIdValidation, deleteEstate);

module.exports = estateRouter;
