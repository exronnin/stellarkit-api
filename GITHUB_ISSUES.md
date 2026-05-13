# Pre-written GitHub Issues for StellarKit API
# Post these on your repo after pushing to GitHub.
# These are designed to match Stellar Wave complexity levels.
# ============================================================


## ISSUE 1 — TRIVIAL (100 pts)
Title: Add `Content-Type` header validation middleware

Description:
Currently the API accepts requests without checking the `Content-Type` header on
POST/PATCH routes. Add a middleware that returns a clear `400` error if a future
POST route receives a body that isn't `application/json`.

**Acceptance Criteria:**
- Middleware added to `src/middleware/`
- Returns `{ success: false, error: { type: "ValidationError", message: "..." } }` if
  Content-Type is wrong on a body-expecting route
- Unit test added to `tests/`

**Labels:** `good first issue`, `trivial`, `middleware`

---

## ISSUE 2 — TRIVIAL (100 pts)
Title: Add request logging for errors (4xx/5xx) to console

Description:
Right now morgan logs all requests. Add additional logging specifically for 4xx
and 5xx responses in the error handler so maintainers can quickly spot issues.

**Acceptance Criteria:**
- `errorHandler.js` logs the error method, path, status, and message to `console.error`
- Logging is suppressed when `NODE_ENV=test`

**Labels:** `good first issue`, `trivial`, `dx`

---

## ISSUE 3 — TRIVIAL (100 pts)
Title: Add `GET /account/:id/balances` shortcut endpoint

Description:
`GET /account/:id` returns a lot of data. Add a lightweight endpoint that returns
only the account's balances (XLM + assets) for developers who just need balances.

**Acceptance Criteria:**
- `GET /account/:id/balances` returns `{ xlm: {...}, assets: [...] }`
- Reuses existing `validateAccountId` helper
- Test added

**Labels:** `good first issue`, `trivial`, `feature`

---

## ISSUE 4 — MEDIUM (150 pts)
Title: Add in-memory caching for `/network-status` and `/fee-estimate`

Description:
`/network-status` and `/fee-estimate` hit Horizon on every request. Since these
values change only per ledger (~5 seconds), add a simple in-memory TTL cache
(no external dependency) to reduce redundant Horizon calls.

**Acceptance Criteria:**
- Cache TTL configurable via `CACHE_TTL_MS` env var (default: `5000`)
- Cache is bypassed with `?fresh=true` query param
- Response includes `X-Cache: HIT` or `X-Cache: MISS` header
- Tests cover both cache hit and miss scenarios

**Labels:** `medium`, `performance`, `feature`

---

## ISSUE 5 — MEDIUM (150 pts)
Title: Add `GET /account/:id/payments` endpoint

Description:
Add a dedicated endpoint that returns only payment operations for an account
(filtering out non-payment operation types like `create_account`, `change_trust`, etc.).

**Acceptance Criteria:**
- `GET /account/:id/payments` returns only `payment` and `create_account` operations
- Supports `limit`, `order`, `cursor` query params (same as `/transactions/:id`)
- Returns amount, asset, sender, receiver per payment
- Tests added

**Labels:** `medium`, `feature`

---

## ISSUE 6 — MEDIUM (150 pts)
Title: Add `/fee-estimate` historical comparison (last 5 ledgers)

Description:
Extend `/fee-estimate` to also return a simple array of fee stats from the last
5 ledgers, so developers can see whether fees are trending up or down.

**Acceptance Criteria:**
- Response includes a `history` array with `ledger`, `baseFee`, `capacityUsage` for last 5 ledgers
- Fetched from Horizon ledger records
- Tests cover the shape of the history array

**Labels:** `medium`, `feature`, `stellar`

---

## ISSUE 7 — HIGH (200 pts)
Title: Add `GET /account/:id/trustlines` with issuer home domain resolution

Description:
Add an endpoint that returns all trustlines for an account, and for each asset
attempts to resolve the issuer's `home_domain` from their Stellar account and
fetches the `stellar.toml` to return the asset's official name and description.

**Acceptance Criteria:**
- `GET /account/:id/trustlines` returns all non-native balances
- For each asset, attempt to resolve issuer home_domain → fetch `https://<home_domain>/.well-known/stellar.toml`
- Parse TOML to extract `name`, `desc`, `image` for the asset if available
- Gracefully handles issuers with no home_domain or unreachable TOML
- Adds `toml` field to each asset: `{ name, description, image } | null`
- Tests cover both resolved and unresolved cases

**Labels:** `high`, `feature`, `stellar`, `toml`

---

## ISSUE 8 — HIGH (200 pts)
Title: Add WebSocket endpoint for real-time ledger updates

Description:
Add a `/stream/ledgers` WebSocket endpoint that streams live ledger close events
from Horizon using the Stellar SDK's event streaming (`.stream()`). Clients
connecting to this endpoint should receive a JSON message each time a new ledger closes.

**Acceptance Criteria:**
- Uses `ws` npm package for WebSocket server
- Subscribes to Horizon ledger stream via `server.ledgers().stream()`
- Each message is JSON: `{ sequence, closedAt, baseFee, transactionCount }`
- Gracefully handles client disconnect and stream errors
- Documented in README under a new "Streaming" section
- Basic test using a WebSocket client

**Labels:** `high`, `feature`, `streaming`, `stellar`
