const debug = require('debug')('yagnostic-api: proposal.controller');

const proposalService = require('../../services/proposal/proposal.service');

/*
 * Send proposal coins by contract address request
 * */
async function create(req, res) {
  try {
    await proposalService.createProposal(req.body);
    return res.status(200).send('OK');
  } catch (err) {
    debug('create() err: %o', err);
    return res.status(500).send(err.message);
  }
}

async function get(req, res) {
  try {
    const data = await proposalService.getProposals(req.body);
    return res.status(200).json(data);
  } catch (err) {
    debug('get() err: %o', err);
    return res.status(500).send(err.message);
  }
}

module.exports = {
  create,
  get,
};
