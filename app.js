require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const fileUpload = require('express-fileupload');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('./middlewares/cors');
const centralizedError = require('./middlewares/centralizedError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/routes');
const {buildUrlImageEstate, baseUrlImageEstate} = require("./utils/constants");

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/estate'); // localhost || 127.0.0.1

app.use('/public/images/estates/uncompressed/', express.static(baseUrlImageEstate))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(cors);
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : path.join(__dirname,'tmp'),
}));

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(centralizedError);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
