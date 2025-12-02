import User from "../models/User.js";
import Recipe from "../models/Recipe.js";
import Report from "../models/Report.js";

export const overview = async (_req, res) => {
  const [users, recipes, reports] = await Promise.all([
    User.countDocuments(), Recipe.countDocuments(), Report.countDocuments()
  ]);
  res.json({ users, recipes, reports });
};

export const setRecipeStatus = async (req, res) => {
  const doc = await Recipe.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(doc);
};