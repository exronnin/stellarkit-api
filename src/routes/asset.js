const express = require("express");
const router = express.Router();
const { server } = require("../config/stellar");
const { success } = require("../utils/response");
const { validateAccountId, validateAssetCode } = require("../utils/validators");

/**
 * GET /asset/:code/:issuer
 * Returns metadata and statistics for a Stellar asset.
 *
 * @param {string} code   - Asset code (e.g. USDC)
 * @param {string} issuer - Issuer account public key (G...)
 *
 * @example
 * GET /asset/USDC/GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN
 */
router.get("/:code/:issuer", async (req, res, next) => {
  try {
    const { code, issuer } = req.params;
    validateAssetCode(code);
    validateAccountId(issuer);

    const assetCode = code.toUpperCase();

    const assetsResponse = await server
      .assets()
      .forCode(assetCode)
      .forIssuer(issuer)
      .call();

    if (!assetsResponse.records || assetsResponse.records.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          type: "NotFound",
          message: `Asset ${assetCode} issued by ${issuer} was not found on the Stellar network.`,
        },
      });
    }

    const asset = assetsResponse.records[0];

    // Also fetch issuer account for home_domain
    let issuerInfo = null;
    try {
      const issuerAccount = await server.loadAccount(issuer);
      issuerInfo = {
        homeDomain: issuerAccount.home_domain || null,
        flags: issuerAccount.flags,
        thresholds: issuerAccount.thresholds,
      };
    } catch (_) {
      // Issuer account info is optional
    }

    return success(res, {
      assetCode: asset.asset_code,
      assetIssuer: asset.asset_issuer,
      assetType: asset.asset_type,
      amount: asset.amount,
      numAccounts: asset.num_accounts,
      numClaimableBalances: asset.num_claimable_balances,
      numLiquidityPools: asset.num_liquidity_pools,
      claimableBalancesAmount: asset.claimable_balances_amount,
      liquidityPoolsAmount: asset.liquidity_pools_amount,
      flags: asset.flags,
      issuer: issuerInfo,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /asset/search?code=USDC
 * Searches for all assets matching a given code (across all issuers).
 *
 * Query params:
 *   - code  (string, required)
 *   - limit (number, default: 10)
 *
 * @example
 * GET /asset/search?code=USDC
 */
router.get("/search", async (req, res, next) => {
  try {
    const { code, limit: rawLimit } = req.query;

    if (!code) {
      const err = new Error("Query parameter 'code' is required.");
      err.isValidation = true;
      throw err;
    }

    validateAssetCode(code);
    const assetCode = code.toUpperCase();
    const limit = Math.min(parseInt(rawLimit) || 10, 50);

    const assetsResponse = await server
      .assets()
      .forCode(assetCode)
      .limit(limit)
      .call();

    const assets = assetsResponse.records.map((a) => ({
      assetCode: a.asset_code,
      assetIssuer: a.asset_issuer,
      assetType: a.asset_type,
      amount: a.amount,
      numAccounts: a.num_accounts,
      flags: a.flags,
    }));

    return success(res, assets, {
      meta: { count: assets.length, query: assetCode },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
