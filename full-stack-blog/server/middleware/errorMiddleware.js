function notFound(req, res, next) {
  res.status(404);
  return next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  let status = res.statusCode >= 400 ? res.statusCode : 500;
  let message = error.message || 'An unexpected server error occurred.';
  let errors;

  if (error.name === 'ValidationError') {
    status = 400;
    errors = Object.values(error.errors).map((item) => item.message);
    message = errors[0];
  } else if (error.code === 11000) {
    status = 409;
    message = 'An account with this email already exists.';
  } else if (error.name === 'CastError') {
    status = 400;
    message = 'Invalid resource identifier.';
  }

  if (status >= 500) {
    console.error(error);
    if (process.env.NODE_ENV === 'production') message = 'An unexpected server error occurred.';
  }

  return res.status(status).json({ message, ...(errors ? { errors } : {}) });
}

module.exports = { notFound, errorHandler };