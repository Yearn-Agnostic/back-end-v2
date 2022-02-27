const Bridge = require('./services/bridge/bridge.service');

module.exports.start = async () => {
  // eslint-disable-next-line
  new Bridge();
};
