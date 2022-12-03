const estateRouter = require('express').Router();
const {
  estateIdValidation,
} = require('../middlewares/validatons');

const {
  postEstate,
  getEstates,
  getEstate,
  updateEstate,
  deleteEstate
} = require('../controllers/estates');

estateRouter.post('/estate', postEstate);
estateRouter.get('/estate', getEstates);
estateRouter.get('/estate/:estateId', estateIdValidation, getEstate);
estateRouter.patch('/estate', updateEstate);
estateRouter.delete('/estate/:estateId', estateIdValidation, deleteEstate);

module.exports = estateRouter;
