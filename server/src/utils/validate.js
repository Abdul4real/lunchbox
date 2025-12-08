export const validate = (schema) => (req, res, next) => {
  try {
    const data = schema.parse({ body: req.body, query: req.query, params: req.params });
    Object.assign(req, data);
    next();
  } catch (e) {
    return res.status(400).json({ message: e.errors?.[0]?.message || "Validation error" });
  }
};