const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const Resume = require("../models/Resume");
const fs = require("fs");

// upload config
const upload = multer({ dest: "uploads/" });

// ================== UPLOAD ==================
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const buffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(buffer);

    const text = pdfData.text.toLowerCase();

    // email
    const emailMatch = text.match(/\S+@\S+\.\S+/);
    const email = emailMatch ? emailMatch[0] : "Not found";

    // phone
    const phoneMatch = text.match(/\d{10}/);
    const phone = phoneMatch ? phoneMatch[0] : "Not found";

    // skills
    const skillsList = [
      "javascript", "java", "python", "c++",
      "react", "node", "mongodb", "express",
      "html", "css", "sql", "mysql",
      "git", "github", "aws", "docker"
    ];

    const skills = skillsList.filter(skill => text.includes(skill));

    // ATS
    const atsScore = Math.round((skills.length / skillsList.length) * 100);

    // suggestions
    let suggestions = [];

    if (atsScore < 30) {
      suggestions.push("Add more technical skills relevant to your field");
      suggestions.push("Improve resume formatting and structure");
    }

    if (skills.length < 5) {
      suggestions.push("Include more relevant technologies (React, Node, DB)");
    }

    if (email === "Not found") {
      suggestions.push("Add a valid email address");
    }

    if (phone === "Not found") {
      suggestions.push("Include a valid phone number");
    }

    if (suggestions.length === 0) {
      suggestions.push("Your resume looks good! Try tailoring it for specific jobs.");
    }

    // save
    const saved = await Resume.create({
      fileName: req.file.originalname,
      filePath: req.file.path,
      email,
      phone,
      skills,
      rawText: text,
      atsScore,
      suggestions
    });

    res.json({
      email,
      phone,
      skills,
      atsScore,
      suggestions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ================== GET ==================
router.get("/", async (req, res) => {
  const data = await Resume.find().sort({ createdAt: -1 });
  res.json(data);
});

// ================== DELETE ==================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Resume.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;