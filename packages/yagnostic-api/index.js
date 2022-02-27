require('dotenv').config();
const express = require('express');
const config = require('config');
const debug = require('debug')('yagnostic-api: index.js');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const swaggerDocument = require('./swagger.json');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const routes = require('./api').default;
const { start } = require('./app');

start().then(() => {
  const options = {
    explorer: true,
  };

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, options)
  );
  app.use('/', routes());
  app.use('/', (req, res) => {
    res.send('Alive');
  });

  app.listen(config.port, () => {
    debug('Listening on %o', config.port);
  });
});
