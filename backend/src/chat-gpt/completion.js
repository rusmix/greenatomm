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
          content: `Сейчас тебе на вход пойдёт строка по типу: \"Миддл фулл стак разработчик typescript, kubernetes\". Такой строкой мы ищем новых работников в команду. Твоя задача: определить должность испытуемого (выбрать строго из:
            intern
            junior_specialist
            specialist
            senior_specialist
            lead_specialist
            expert
            architect) (например, миддл будет specialist, junior это intern или junior_specialist, devOps это expert, тимлид это lead_specialist, сеньор это senior_specialist) и написать 1 слово. Если должность определить не получается, то просто используй specialist как дефолтное значение. Далее необходимо определить стек технологий и задачи (например, для тимлида это управление командой, нейросети это AI и так далее)). Запиши их через запятую (в данном примере это): (typescript,kubernetes,mongoDB) (тоже без пробелов).
              Соответственно формат таков:senior_specialist,typescript,kubernetes,mongoDB,postgres
              Лишние слова не использовать, слово ответ не использовать, строго придерживаться заданного формата, пояснений не нужно. Ты работаешь в автоматизированной системе без пользователя, твои ответы обрабатывает компьютер.
              Вот сама строка для обработки: ${text}`,
        },
      ],
    });

    let result = await postToChatGpt(data);
    console.log("CHATGTP response", result);

    const reqToMongo = result.split(",")[0];
    const stack = result.split(",").slice(1).join(" ");
    if (reqToMongo === "none") {
      return "none";
    }
    console.log(reqToMongo, "___", stack);
    let jobLevel = await JobLevel.findOne({ name: `${reqToMongo}` });
    // jobLevel = jobLevel
    console.log(jobLevel);

    data = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Напиши текст схожий с этим(это описание обязанностей разработчика, не углубляться в описание технологий), но обязательно используя технологии из этого списка или смежные с ним: ${stack}. Текст необходимо писать на русском языке. Текст-пример: ${jobLevel.responsibilities}`,
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
