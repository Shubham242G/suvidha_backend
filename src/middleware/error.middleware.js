export const errorHandler = (err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  console.error('ERROR:', message);
  res.status(status).json({ success: false, message });
};

export const notFound = (_req, res) =>
  res.status(404).json({ success: false, message: 'Route not found' });