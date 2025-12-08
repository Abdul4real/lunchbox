import { z } from "zod";
import Report from "../models/Report.js";

export const createReport = async (req, res) => {
  const schema = z.object({ body: z.object({ reason: z.string().min(3) }) });
  schema.parse(req);
  const report = await Report.create({ recipe: req.params.id, reporter: req.user.id, reason: req.body.reason });
  res.status(201).json(report);
};

export const listReports = async (_req, res) => {
  const rows = await Report.find().populate("recipe","title").populate("reporter","name").sort("-createdAt");
  res.json(rows);
};

export const setReportStatus = async (req, res) => {
  const { status } = req.body; // approved | dismissed
  const r = await Report.findByIdAndUpdate(req.params.reportId, { status }, { new: true });
  res.json(r);
};