const { StrKey } = require("@stellar/stellar-sdk");

/**
 * Validates a Stellar account ID (public key).
 */
function validateAccountId(accountId) {
  if (!accountId) {
    const err = new Error("Account ID is required.");
    err.isValidation = true;
    throw err;
  }
  if (!StrKey.isValidEd25519PublicKey(accountId)) {
    const err = new Error(
      `Invalid Stellar account ID: "${accountId}". Must be a valid Ed25519 public key starting with "G".`
    );
    err.isValidation = true;
    throw err;
  }
}

/**
 * Validates an asset code (1–12 alphanumeric characters).
 */
function validateAssetCode(code) {
  if (!code) {
    const err = new Error("Asset code is required.");
    err.isValidation = true;
    throw err;
  }
  if (!/^[A-Z0-9]{1,12}$/.test(code.toUpperCase())) {
    const err = new Error(
      `Invalid asset code: "${code}". Must be 1–12 uppercase alphanumeric characters.`
    );
    err.isValidation = true;
    throw err;
  }
}

/**
 * Validates a pagination limit parameter.
 */
function validateLimit(limit, max = 200) {
  const parsed = parseInt(limit);
  if (isNaN(parsed) || parsed < 1 || parsed > max) {
    const err = new Error(`Limit must be a number between 1 and ${max}.`);
    err.isValidation = true;
    throw err;
  }
  return parsed;
}

module.exports = { validateAccountId, validateAssetCode, validateLimit };
