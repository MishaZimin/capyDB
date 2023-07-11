const TelegramBot = require('node-telegram-bot-api');
const WebSocket = require('ws');
const token = '6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo';

const bot = new TelegramBot(token, { polling: true });

// Создаем WebSocket сервер
const wss = new WebSocket.Server({ port: 8080 });

// Обработка входящих WebSocket-соединений
wss.on('connection', (ws) => {
  console.log('Установлено новое WebSocket соединение');

  // Обработка входящих сообщений
  ws.on('message', (message) => {
    console.log('Получено сообщение из WebSocket:', message);
    // Делайте что-то с сообщением, если необходимо
  });
});

// Обработка входящих сообщений Telegram
bot.on('message', (msg) => {
  const messageData = msg;

  console.log('Получено сообщение:', messageData);

  // Преобразуем объект messageData в строку
  const messageDataString = JSON.stringify(messageData);

  // Отправляем сообщение через WebSocket каждому клиенту
  wss.clients.forEach((client) => {
    client.send(messageDataString);
  });

  // Отправляем ответное сообщение в Telegram
  bot.sendMessage(msg.chat.id, 'Получено');
});
