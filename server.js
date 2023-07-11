const express = require('express');
const app = express();

app.use(express.json());

app.post('	https://webhook.site/f7d4041e-335c-4a95-aa4d-5187eaab4c54', (req, res) => {
  const message = req.body.message;
  console.log('Получено сообщение:', message);
  // Добавьте здесь код для обработки сообщения

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Веб-сервер запущен на порту 3000');
});