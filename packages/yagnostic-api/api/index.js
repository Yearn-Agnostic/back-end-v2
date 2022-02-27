const express = require('express');

const { Router } = express;

const proposalRouter = require('./routes/proposal.router').default;

exports.default = () => {
  const app = Router();

  /* Register new routers here */
  proposalRouter(app);

  return app;
};
