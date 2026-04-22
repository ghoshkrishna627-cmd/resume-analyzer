const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String, // where file is stored (uploads/)
      default: "",
    },

    email: {
      type: String,
      default: "Not found",
    },

    phone: {
      type: String,
      default: "Not found",
    },

    skills: {
      type: [String],
      default: [],
    },

    atsScore: {
      type: Number,
      default: 0,
    },

    rawText: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["uploaded", "processed"],
      default: "processed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);