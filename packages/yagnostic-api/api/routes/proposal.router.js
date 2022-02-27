const express = require('express');

const router = express.Router();

const proposalController = require('../../controllers/proposal/proposal.controller');

exports.default = (app) => {
  app.use('/proposal', router);
  router.post('/create', proposalController.create);
  router.post('/get', proposalController.get);
};
