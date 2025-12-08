export function notFound(_req, res) {
  res.status(404).json({ message: "Route not found" });
}
export function errorHandler(err, _req, res, _next) {
  console.error(err);
  const code = err.status || 500;
  res.status(code).json({ message: err.message || "Server error" });
}