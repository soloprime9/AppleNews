const mongoose = require("mongoose");

const sourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    website: { type: String, required: true },
    rssUrl: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    logo: { type: String },
    category: { type: String, default: "Apple" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Source", sourceSchema);
