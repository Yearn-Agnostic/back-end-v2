const debug = require('debug')('yagnostic-api: Bridge.js');
const Wallet = require('../../classes/wallet/wallet');
const knex = require('../../database/knex');
const { tables } = require('../../database/info');
const { error, info } = require('./bridge.messages');
const { listenDelay, blockDelay } = require('../../utils/utils');
const EmailSender = require('../../classes/email/email');
const { query, getTxToSend, getTxToCheck } = require('./subgraph.queries');

class Bridge {
  constructor() {
    this.eth = new Wallet('eth');
    this.bsc = new Wallet('bsc');
    this.handleDelay = 0;
    setTimeout(
      this.processData.bind(this, this.bsc.chain),
      this.eth.config.interval
    );
    setTimeout(
      this.processData.bind(this, this.eth.chain),
      this.bsc.config.interval
    );
  }

  async processData(transfer) {
    this.handleDelay = 0;
    const knexTxProvider = knex.transactionProvider();
    const knexTx = await knexTxProvider();
    const { oppositeChain, transaction } = this[transfer].config;
    try {
      const currentBlock = await this[
        oppositeChain
        ].connection.eth.getBlockNumber();
      const resp = await knexTx(tables.graph_block).where({
        network: this[transfer].config.oppositeChain,
      });
      const block =
        resp.length === 0 || +resp[0].block === 0
          ? this[oppositeChain].config.blockCreation
          : +resp[0].block + 1;
      if (currentBlock - +block >  2 * this[oppositeChain].config.transaction.confirmations) {

        const transfers = await this[oppositeChain].contract.getPastEvents(
          'TransferRequested',
          {
            fromBlock: block,
            toBlock: +block + this[oppositeChain].config.transaction.confirmations,
            filter: { step: '0' },
          }
        );

        for (let i = 0; i < transfers.length; i += 1) {
          const val = {
            ...transfers[i].returnValues,
            block:transfers[i].blockNumber
          };
          const bindedContract = this.proceedEvent.bind(this[transfer]);
          // eslint-disable-next-line
          await bindedContract(val);
          // eslint-disable-next-line
          await knexTx.raw(
            `
            INSERT INTO ${tables.graph_block} ( network, block ) VALUES (?, ?)
            ON CONFLICT ( network ) DO UPDATE SET block = ?
            `,
            [oppositeChain, val.block, val.block]
          );
        }

        if (transfers.length === 0) {
          const saveBlock =+block + this[oppositeChain].config.transaction.confirmations;
          await knexTx.raw(
            `
            INSERT INTO ${tables.graph_block} ( network, block) VALUES (?, ?)
            ON CONFLICT ( network ) DO UPDATE SET block = ?
            `,
            [oppositeChain, saveBlock, saveBlock]
          );
        }
      }
      await knexTx.commit();
    } catch (err) {
      debug('processData err: %O', err.message);
      this.handleDelay = listenDelay;
      await knexTx.rollback();
    }
    setTimeout(
      this.processData.bind(this, transfer),
      this[transfer].config.interval + this.handleDelay
    );
  }

  async proceedEvent(data) {
    try {
      const {subgraphURI, transaction } = this.config;
      const { from, to, amount, transactionId, signature } = data;
      // const check = await this.contract.getPastEvents('TransferRequested', {
      //   filter: {
      //     step: '1',
      //     transactionId: `${transactionId}`,
      //     from: `${from}`,
      //   },
      //   fromBlock: this.config.blockCreation,
      // });

      const { check } = (await query(subgraphURI,getTxToCheck(transactionId,from)))?.data;
      if (check.length !== 0) {
        for (let i = 0; i < check.length; i += 1) {
          if (check[i].to === to.toLowerCase()) return;
        }
      }
      const methodCall = await this.contract.methods
        .unlockTokens(from, to, amount, transactionId, signature)
        .send({
          from: this.account.address,
          gas: transaction.gasLimit,
          gasPrice: Math.round(
            transaction.gasPriceMultiplier *
            (await this.connection.eth.getGasPrice())
          ),
        });
      debug('Chain %o => %o', this.chain, methodCall.transactionHash);
    } catch (err) {
      debug('proceedEvent chain:%o err: %O', this.chain, err.message);
      if (err.message.includes(error.notEnoughAmount)) {
        await EmailSender.sendAlarmEmail({
          subject: this.chain.toUpperCase() + info.bridgeLowFunds,

          text: `${this.chain.toUpperCase()} ${info.notEnoughAmountToSendTx}  ${
            // eslint-disable-next-line
            this.contract._address
          }`,
        }).catch((e) => debug('emailSend err -> %o', e.message));
        throw Error(info.updateDelay);
      } else {
        await EmailSender.sendAlarmEmail({
          subject: this.chain.toUpperCase() + info.unknownError,
          // eslint-disable-next-line
          text: `${this.chain.toUpperCase()} ${err.message}`,
        }).catch((e) => debug('emailSend err -> %o', e.message));
      }
      throw err;
    }
  }
}

module.exports = Bridge;
