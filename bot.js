const TelegramBot = require('node-telegram-bot-api');
const WebSocket = require('ws');
const token = '6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo';

const bot = new TelegramBot(token, { polling: true });
const wss = new WebSocket.Server({ port: 8080 });


wss.on('connection', (ws1) => {
  console.log('Установлено новое WebSocket соединение');
  ws1.on('message', (message) => {
    console.log('Получено сообщение из WebSocket:', message);
  });
});

bot.on('message', (msg) => {
  const messageData = msg;
  console.log('Получено сообщение:', messageData);
  const messageDataString = JSON.stringify(messageData);
  wss.clients.forEach((client) => {
    client.send(messageDataString);
  });
  bot.sendMessage(msg.chat.id, 'Получено');
});
