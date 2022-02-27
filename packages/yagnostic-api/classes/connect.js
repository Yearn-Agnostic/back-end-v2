const config = require('config');
const Web3 = require('web3');

class Connection {
  constructor(chain) {
    this.config = { ...config.chain[chain], privateKey: config.privateKey };
    this.connection = new Web3(
      new Web3.providers.HttpProvider(this.config.httpProvider)
    );
    this.contract = new this.connection.eth.Contract(
      this.config.abi,
      this.config.address
    );
    this.chain = chain;
    this.zeroAddress = '0x0000000000000000000000000000000000000000';
  }
}

module.exports = Connection;
