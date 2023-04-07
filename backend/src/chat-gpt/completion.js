const openai = require("./index");
const { JobLevel } = require("../models/jobs");
const axios = require("axios");
let apiKey = process.env.OPENAI_API_KEY;
require("dotenv").config();
async function postToChatGpt(data) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.openai.com/v1/chat/completions",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    data: data,
  };
  let completion = await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      let output = response.data.choices[0].message;
      return output;
    })
    .catch(function (error) {
      console.log(error, "error in calling chat completion");
    });
  console.log("CHATGTP response", completion);
  return completion.content;
}

async function sendToChatGpt(text) {
  try {
    let data = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Сейчас тебе на вход пойдёт строка по типу: \"Миддл фулл стак разработчик typescript, kubernetes\". Такой строкой мы ищем новых работников в команду. Твоя задача: определить должность испытуемого (выбрать из:
            intern
            junior_specialist
            specialist
            senior_specialist
            lead_specialist
            expert
            architect) и написать 1 слово. Далее необходимо определить стек технологий(также можно добавить что-то новое, схожее с этим). Запиши их через запятую (в данном примере это): (typescript,kubernetes,mongoDB) (тоже без пробелов).
              Соответственно формат таков:senior_specialist,typescript,kubernetes,mongoDB,postgres,react
              Лишние слова не использовать, слово ответ не использовать, строго придерживаться заданного формата, пояснений не нужно. Ты работаешь в автоматизированной системе без пользователя, твои ответы обрабатывает компьютер. Если не удаётся подобрать должность, то просто отправляй none
              Вот сама строка для обработки: ${text}`,
        },
      ],
    });

    let result = await postToChatGpt(data);
    console.log("CHATGTP response", result);

    const reqToMongo = result.split(",")[0];
    const stack = result.split(",").slice(1).join(" ");
    if (reqToMongo === "none") throw "Can't find proper role";
    console.log(reqToMongo, "___", stack);
    let jobLevel = await JobLevel.findOne({ name: `${reqToMongo}` });
    // jobLevel = jobLevel
    console.log(jobLevel);

    data = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Напиши текст схожий с этим, но используя другие технологии (что должен уметь специалист?) (добавь схожие технологии от себя): ${stack}. Текст-пример: ${jobLevel.responsibilities}`,
        },
      ],
    });

    result = await postToChatGpt(data);

    jobLevel.responsibilities = result;
    return jobLevel;
    console.log("ощидумуд ______", jobLevel);
  } catch (e) {
    console.log(e, "error in the callChatGTP function");
  }
}

module.exports = sendToChatGpt;
