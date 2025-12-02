import { z } from "zod";
import User from "../models/User.js";

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).populate("bookmarks", "title image time");
  res.json(user);
};

export const updateMe = async (req, res) => {
  const schema = z.object({ body: z.object({ name: z.string().min(2).optional() }) });
  schema.parse(req);
  const user = await User.findByIdAndUpdate(req.user.id, { name: req.body.name }, { new: true });
  res.json(user);
};