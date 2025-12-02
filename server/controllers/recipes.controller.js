import { z } from "zod";
import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import pick from "../utils/pick.js";

export const createRecipe = async (req, res) => {
  const schema = z.object({
    body: z.object({
      title: z.string().min(2),
      image: z.string().optional(),
      time: z.string().optional(),
      ingredients: z.array(z.string()).default([]),
      steps: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([])
    })
  });
  schema.parse(req);
  const recipe = await Recipe.create({ ...req.body, author: req.user.id });
  res.status(201).json(recipe);
};

export const listRecipes = async (req, res) => {
  // q=keyword&tags=Vegan,Quick&sort=rating|-createdAt&page=1&limit=12
  const { q, tags, sort = "-createdAt", page = 1, limit = 12 } = pick(req.query, ["q","tags","sort","page","limit"]);
  const filter = { status: "approved" };
  if (q) filter.$text = { $search: q };
  if (tags) filter.tags = { $in: tags.split(",") };

  const cursor = Recipe.find(filter);
  const total = await Recipe.countDocuments(filter);
  const data = await cursor
    .sort(sort.split(",").join(" "))
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .lean();

  res.json({ total, page: Number(page), limit: Number(limit), data });
};

export const getRecipe = async (req, res) => {
  const r = await Recipe.findById(req.params.id).lean();
  if (!r) return res.status(404).json({ message: "Not found" });
  res.json(r);
};

export const updateRecipe = async (req, res) => {
  const allowed = pick(req.body, ["title","image","time","ingredients","steps","tags"]);
  const r = await Recipe.findOneAndUpdate({ _id: req.params.id, author: req.user.id }, allowed, { new: true });
  if (!r) return res.status(404).json({ message: "Not found or no permission" });
  res.json(r);
};

export const deleteRecipe = async (req, res) => {
  const r = await Recipe.findOneAndDelete({ _id: req.params.id, author: req.user.id });
  if (!r) return res.status(404).json({ message: "Not found or no permission" });
  res.json({ ok: true });
};

export const toggleBookmark = async (req, res) => {
  const user = await User.findById(req.user.id);
  const idx = user.bookmarks.findIndex(id => id.toString() === req.params.id);
  if (idx > -1) user.bookmarks.splice(idx, 1);
  else user.bookmarks.push(req.params.id);
  await user.save();
  res.json({ bookmarks: user.bookmarks });
};
