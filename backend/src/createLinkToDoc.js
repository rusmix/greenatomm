const HTMLtoDOCX = require("html-to-docx");
const fs = require("fs");
const path = require("path");
const port = process.env.PORT;
const { Instruction } = require("./models/instructions");
var docxConverter = require('docx-pdf');



async function saveDoc(answer) {
  const filename = `${answer.name}.docx`;
  switch (answer.name) {
    case "intern":
      answer.name = "Стажер";
      break;
    case "junior_specialist":
      answer.name = "Младший специалист";
      break;
    case "specialist":
      answer.name = "Специалист";
      break;
    case "senior_specialist":
      answer.name = "Старший специалист";
      break;
    case "lead_specialist":
      answer.name = "Ведущий специалист";
      break;
    case "expert":
      answer.name = "Эксперт";
      break;
    case "architect":
      answer.name = "Архитектор";
      break;
  }
  const filePath = path.join(__dirname, "files", filename);
  let htmlString = `<!DOCTYPE html>
      <html>
        <head>
          <title>ДИ</title>
        </head>
        <body>
          <div style="display: flex; justify-content: center; width: 100%; padding: 10px; right: 10px;">
            <div style="padding: 10px; margin-left: 2000px; font-weight: 700;">
              <div>УТВЕРЖДАЮ</div>
              <div>Заместитель генерального директора,</div>
              <div>директор по работе с персоналом АО «Предприятие»</div>
              <div>_______________/А.А. Иванов/</div>
              <div>«____»_______________ 202__ г.</div>
            </div>
          </div>
          <div><h1 style="text-align: center;">Должностная инструкция</h1>
          <table style="border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">
            <tr>
              <td style="background-color: lightgrey; font-weight: 550; border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">Должность:     </td>
              <td style="border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">${answer.name}</td>
            </tr>
            <tr>
              <td style="background-color: lightgrey; font-weight: 550; border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">Группа, Отдел, Центр   </td>
              <td style="border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">Департамент систем, Управление информационными системами, Отдел разработки</td>
            </tr>
            <tr>
              <td style="background-color: lightgrey; font-weight: 550; border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">Генеральный директор/
                Заместитель Генерального
                директора
                (в чьем подчинении находится
                должность. В случае двойного
                подчинения указать административного
                и функционального руководителей)</td>
              <td style="border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">Начальник отдела</td>
            </tr>
          </table>
          <table style="border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">
            <tr>
              <td style="background-color: lightgrey; font-weight: 550; border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">1. Цель должности</td>
            </tr>
            <tr>
              <td style="border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;"> ${answer.goal}</td>
            </tr>
            <tr> 
              <td style="background-color: lightgrey; font-weight: 550; border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">2. Основные обязанности</td>
            </tr>
            <tr>
              <td style="border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">
              ${answer.duty}
              </td>
            </tr>
            <tr>
              <td style="background-color: lightgrey; font-weight: 550; border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">3. Уровень контактов/коммуникаций </td>
            </tr>
            <tr>
              <td style="border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">Функциональный руководитель.<br>Административный руководитель, работники подразделения, работники смежных подразделений
              в рамках исполнения должностных обязанностей.<br>Ключевые или конечные пользователи по направлению группы.</td>
            </tr>
            <tr>
              <td style="background-color: lightgrey; font-weight: 550; border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">4. Требования должности:</td>
            </tr>
            <tr>
              <td style="border: 1px solid black; font-weight: 550; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">
                ${answer.responsibilities}
              </td>
            </tr>
          </table>
          <table style="border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">
            <tr>
              <td style="background-color: lightgrey; font-weight: 550; border: 1px solid black; border-collapse: collapse; padding: 10px; margin: auto; width: 2450px;">5. Согласовно:</td>
            </tr>
            <tr>
              <td style="font-weight: 550;"> <br>Начальник управления ______________________________________/__________________/<br>(подпись) (ФИО)<br><br><br>Начальник отдела ______________________________________/__________________/ <br>(подпись) (ФИО)</td>
            </tr>
            <tr>
              <td style="font-weight: 550;"> С должностной инструкцией ознакомлен и обязуюсь соблюдать: <br><br>_______________________________/___________________________________________________ <br>(подпись работника, дата) (ФИО)</td>
            </tr>
          </table>
        </div>
        </body>

      </html>`;

  const fileBuffer = await HTMLtoDOCX(htmlString, null, {
    table: { row: { cantSplit: false } },
    footer: true,
    pageNumber: true,
    //orientation: "landscape",
  });

  fs.writeFile(filePath, fileBuffer, (error) => {
    if (error) {
      console.log("Docx file creation failed");
      return;
    }
    console.log("Docx file created successfully");
  });
  return `http://localhost:${port}/api/download/${filename}`;
}

async function createLinkToDoc(answer, text) {
  try {
    if (answer === "none") {
      return "error";
    }
    const doc = answer._doc;
    delete doc._id;
    delete doc._v;
    doc.text = text;
    console.log("\ntestin testing\n");
    console.log("SAVING ANSWER_____", doc);
    const savedInstruction = new Instruction(doc);
    await savedInstruction.save();
    const link = await saveDoc(doc);
    return link;
  } catch (error) {
    console.error("Ошибка при чтении файла HTML:", error);
  }
}

module.exports = {createLinkToDoc, saveDoc};

