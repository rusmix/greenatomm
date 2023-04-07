const mongoose = require("mongoose");
require("dotenv").config();

const jobLevelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  responsibilities: { type: String, required: true },
  goal: { type: String },
  duty: { type: String },
});

const JobLevel = mongoose.model("JobLevel", jobLevelSchema);

module.exports = { JobLevel };
