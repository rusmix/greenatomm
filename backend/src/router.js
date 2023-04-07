const express = require("express");
const sendToChatGpt = require("./chat-gpt/completion");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const docFunc = require("./createLinkToDoc");
const { Instruction } = require("./models/instructions");
var docxConverter = require("docx-pdf");

router.get("/example", (req, res) => {
  res.send("This is an example route");
});

router.get("/", (req, res) => {
  res.send("Привет, мир!");
});
router.get("/history/:filename", async (req, res) => {
  const codedText = req.params.filename;
  console.log(codedText);
  const decodedText = decodeURIComponent(codedText);
  console.log(decodedText);
  const answer = await Instruction.findOne({ text: decodedText });
  console.log(answer);
  const link = (await docFunc.saveDoc(answer)) + "";
  await delay(600);
  const filename = link.split("/").slice(-1).join("");
  console.log(link);
  const filePath = path.join(__dirname, "files", filename);
  console.log(filePath);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Transfer-Encoding", "binary");
  res.setHeader("Content-Type", "application/octet-stream");
  res.sendFile(filePath);
});

router.get("/history", async (req, res) => {
  const history = await Instruction.find().sort({ _id: -1 }).limit(5);
  console.log(history.length);
  const labels = [];
  for (let i = 0; i < history.length; i++) {
    labels.push(history[i].text);
  }
  res.send(labels);
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.get("/download/:filename", async (req, res) => {
  const { filename } = req.params;
  const extension = filename.split(".").slice(-1).join(".");
  console.log(filename, extension);

  const filePath1 = path.join(
    __dirname,
    "files",
    `${filename.split(".").slice(0, -1).join(".")}.docx`
  );
  const filePath = path.join(__dirname, "files", filename);
  console.log("filepath1", filePath1);
  if (extension === "pdf")
    await docxConverter(filePath1, filePath, function (err, result) {
      if (err) {
        console.log(err);
      }
      // console.log("result" + result);
    });

  await delay(3000);
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
  const link = await docFunc.createLinkToDoc(answer, data.text);
  res.send(link);
});

module.exports = router;
