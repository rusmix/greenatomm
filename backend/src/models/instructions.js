const mongoose = require("mongoose");

const instruction = new mongoose.Schema({
    name: { type: String, required: true },
    responsibilities: { type: String, required: true },
    goal: { type: String },
    duty: { type: String },
    text: { type: String },
});

const Instruction = mongoose.model('instruction', instruction);

module.exports = { Instruction };