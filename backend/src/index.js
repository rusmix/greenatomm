const express = require("express");
const app = express();
const router = require("./router");
const cors = require("cors");
const initChatGpt = require("./chat-gpt/index");
const { JobLevel } = require("./models/jobs");
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());
app.use("/api", router);
mongoose.connect(process.env.MONGO_URL);
const port = process.env.PORT
// initChatGpt();
// const newJobLevel = new JobLevel({ name: "архитектор" });
// newJobLevel.responsibilities = `1. Проектирование архитектуры приложения:
// 2. Проектирование Front-end и Back-end:
// 3. Рефакторинг и оптимизация существующих приложений:
// 4. Кросс-платформенная разработка: Разработка приложений, переносимых на разные платформы и устройства; Создание мобильных приложений на основе JavaScript.
// 5. Многопоточность и асинхронное программирование: Обработка многопоточных запросов и операций; Асинхронное программирование на JavaScript.
// 6. Продуктовое управление: Работа с продуктовым командой, включая анализ требований, бюджетирование и планирование; Создание изображения продукта и его маркетинговое продвижение.
// 7. Высшее техническое образование
// `;

// newJobLevel.save((err, doc) => {
//   if (err) console.log(err);
//   console.log(doc);
// });

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
