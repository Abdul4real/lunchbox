import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", index: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    reason: String,
    status: { type: String, enum: ["pending", "approved", "dismissed"], default: "pending", index: true }
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);