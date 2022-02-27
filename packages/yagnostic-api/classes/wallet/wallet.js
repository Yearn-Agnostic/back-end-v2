const Connection = require('../connect');

class Wallet extends Connection {
  constructor(chain) {
    super(chain);
    this.account = this.connection.eth.accounts.wallet.add(
      process.env.PRIVATE_KEY || this.config.privateKey
    );
    this.nonce = null;
  }
}

module.exports = Wallet;
