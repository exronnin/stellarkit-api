/**
 * Wraps data in a consistent success response envelope.
 */
function success(res, data, meta = {}) {
  return res.json({
    success: true,
    ...meta,
    data,
  });
}

/**
 * Formats a Stellar timestamp into a readable ISO string.
 */
function formatTimestamp(ts) {
  if (!ts) return null;
  return new Date(ts).toISOString();
}

/**
 * Strips unnecessary Horizon _links fields from a record.
 */
function stripLinks(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const { _links, ...rest } = obj;
  return rest;
}

module.exports = { success, formatTimestamp, stripLinks };
