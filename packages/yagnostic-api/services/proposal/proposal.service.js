const debug = require('debug')('services: proposals.service');

const { error } = require('./proposal.messages');

const knex = require('../../database/knex');
const { tables } = require('../../database/info');

class ProposalService {
  // eslint-disable-next-line class-methods-use-this
  async createProposal(args) {
    try {
      validateCreateArgs(args);
      await knex.raw(
        `
        INSERT INTO ${tables.proposals} ("id", "description") VALUES (?, ?);
      `,
        [args.id, args.description]
      );
    } catch (e) {
      debug('createProposal err: %o', e);
      throw e;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getProposals(args) {
    try {
      validateGetArgs(args);
      return knex.select().table(tables.proposals).whereIn('id', args.id);
    } catch (e) {
      debug('getProposal err: %o', e);
      throw e;
    }
  }
}

function validateCreateArgs(args) {
  if (!args.id) {
    throw new Error(`${error.field}id`);
  }
  if (!args.description) {
    throw new Error(`${error.field}description`);
  }
}

function validateGetArgs(args) {
  if (!args.id) {
    throw new Error(`${error.field}id`);
  }
  if (args.id.length === 0) {
    throw new Error(`${error.emptyArray}id`);
  }
}

module.exports = new ProposalService();
