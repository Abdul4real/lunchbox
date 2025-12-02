import { z } from "zod";
import Review from "../models/Review.js";
import Recipe from "../models/Recipe.js";

export const addReview = async (req, res) => {
  const schema = z.object({ body: z.object({ stars: z.number().min(1).max(5), text: z.string().optional() }) });
  schema.parse(req);
  const review = await Review.create({ recipe: req.params.id, user: req.user.id, stars: req.body.stars, text: req.body.text });

  // recalc rating
  const agg = await Review.aggregate([
    { $match: { recipe: review.recipe } },
    { $group: { _id: "$recipe", count: { $sum: 1 }, avg: { $avg: "$stars" } } }
  ]);
  const { count = 0, avg = 0 } = agg[0] || {};
  await Recipe.findByIdAndUpdate(review.recipe, { ratingCount: count, ratingAvg: Number(avg.toFixed(2)) });

  res.status(201).json(review);
};

export const listReviews = async (req, res) => {
  const rows = await Review.find({ recipe: req.params.id }).populate("user", "name").sort("-createdAt");
  res.json(rows);
};