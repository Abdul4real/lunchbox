const getErrorMessage = (err) => {
  // Mongo duplicate key
  if (err?.code === 11000 || err?.code === 11001) return "Duplicate key";
  // Mongoose validation
  if (err?.errors) {
    for (const key in err.errors) {
      if (err.errors[key]?.message) return err.errors[key].message;
    }
  }
  return err?.message || "Something went wrong";
};
export default { getErrorMessage };
