/**
 * Global error-handling middleware.
 * Catches any error that propagates through the middleware chain
 * and returns a clean, structured JSON response.
 */
function errorHandler(err, _req, res, _next) {
  console.error('[Error]', err.message || err);

  // Google Auth errors
  if (err.message?.includes('Wrong number of segments') || err.message?.includes('Token used too late')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Google token is invalid or expired',
    });
  }

  // Catch-all
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal Server Error' : err.name || 'Error',
    message: status === 500 ? 'An unexpected error occurred' : err.message,
  });
}

module.exports = errorHandler;
