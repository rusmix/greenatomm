const express = require("express");
const sendToChatGpt = require("./chat-gpt/completion");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const createLinkToDoc = require("./createLinkToDoc");

router.get("/example", (req, res) => {
  res.send("This is an example route");
});

router.get("/", (req, res) => {
  res.send("Привет, мир!");
});

router.get("/download/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "files", filename);
  console.log(filePath);
  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  // Set the headers and send the file
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Transfer-Encoding", "binary");
  res.setHeader("Content-Type", "application/octet-stream");
  res.sendFile(filePath);
});

router.post("/generate-link", async (req, res) => {
  const data = req.body;
  console.log("Received data:", data);
  const answer = await sendToChatGpt(data.text); // получаем объект с данными на скачивание
  const link = await createLinkToDoc(answer);
  res.send(link);
});

module.exports = router;
