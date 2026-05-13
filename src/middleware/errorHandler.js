/**
 * Centralised error handler middleware.
 * Formats Horizon / Stellar SDK errors into consistent JSON responses.
 */
function errorHandler(err, req, res, next) {
  // Stellar / Horizon specific errors
  if (err.response && err.response.data) {
    const horizonError = err.response.data;
    return res.status(err.response.status || 400).json({
      success: false,
      error: {
        type: "HorizonError",
        title: horizonError.title || "Horizon Error",
        detail: horizonError.detail || "An error occurred with the Stellar network.",
        status: horizonError.status || err.response.status,
        extras: horizonError.extras || null,
      },
    });
  }

  // Validation errors (thrown manually)
  if (err.isValidation) {
    return res.status(400).json({
      success: false,
      error: {
        type: "ValidationError",
        message: err.message,
      },
    });
  }

  // Generic errors
  const status = err.status || err.statusCode || 500;
  return res.status(status).json({
    success: false,
    error: {
      type: "ServerError",
      message:
        process.env.NODE_ENV === "production"
          ? "An unexpected error occurred."
          : err.message,
    },
  });
}

module.exports = errorHandler;
