//node "C:\Users\Зимин Михаил\OneDrive\Рабочий стол\hello world\capybaraWebsite\server.js"

{
  const TelegramBot = require("node-telegram-bot-api");
  const WebSocket = require("ws");
  const token = "6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo";
  const { MongoClient } = require("mongodb");
  const uri =
    "mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/mydatabase";

  const bot = new TelegramBot(token, { polling: true });
  const wss = new WebSocket.Server({ port: 8080 });

  wss.on("connection", (ws) => {
    console.log("Установлено новое WebSocket соединение");
    try {
      ws.on("message", async (message) => {
        // console.log('Получено сообщение из WebSocket:', message);

        // if (message === 'get_posts') { // запрос на получение данных

        // }
        try {
          const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          await client.connect();

          const db = client.db("mydatabase");

          const collection = db.collection("posts");

          //const coll = client.db("mydatabase").collection("posts");
          //console.log("------posts: ", JSONposts);

          ws.send(collection); // Отправляем данные клиенту
          await client.close();
        } catch (error) {
          console.error("Ошибка при получении данных из базы данных:", error);
        }
      });
    } catch (error) {
      console.error("Ошибка!");
    }
  });

  wss.on("error", (error) => {
    console.error("WebSocket сервер: произошла ошибка", error);
  });

  bot.on("message", (msg) => {
    const messageData = msg;
    console.log("Получено сообщение из tg:", messageData);
    const messageDataString = JSON.stringify(messageData);

    wss.clients.forEach((client) => {
      client.send(messageDataString);
    });

    bot.sendMessage(msg.chat.id, "Получено");
    saveDataToDatabase(messageData); // Вызов функции сохранения данных
  });

  async function saveDataToDatabase(data) {
    try {
      const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();

      const db = client.db("mydatabase");

      const collection = db.collection("posts");
      await collection.insertOne(data);

      client.close();
    } catch (error) {
      console.error("Ошибка при сохранении данных в базу данных:", error);
    }
  }

  module.exports = { saveDataToDatabase };
}
