require('dotenv').config();
const config = require('config');

function getKnexSettings() {
  const knexConfig = { ...config.postgres };
  knexConfig.connection.host =
    knexConfig.connection.host ||
    process.env.YAGNOSTIC_API_POSTGRES_CONNECTION_HOST;
  knexConfig.connection.port =
    knexConfig.connection.port ||
    process.env.YAGNOSTIC_API_POSTGRES_CONNECTION_PORT;
  knexConfig.connection.password =
    process.env.YAGNOSTIC_API_POSTGRES_CONNECTION_PASSWORD;
  return knexConfig;
}

const blockDelay = 5;
const listenDelay = 300000;

module.exports = {
  getKnexSettings,
  blockDelay,
  listenDelay,
};
