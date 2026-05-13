require("dotenv").config();
const { Horizon } = require("@stellar/stellar-sdk");

const NETWORK = process.env.STELLAR_NETWORK || "testnet";

const HORIZON_URLS = {
  testnet: "https://horizon-testnet.stellar.org",
  mainnet: "https://horizon.stellar.org",
};

const horizonUrl =
  process.env.HORIZON_URL || HORIZON_URLS[NETWORK] || HORIZON_URLS.testnet;

const server = new Horizon.Server(horizonUrl);

module.exports = {
  server,
  horizonUrl,
  NETWORK,
  NETWORKS: HORIZON_URLS,
};
