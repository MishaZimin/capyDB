//node "C:\Users\Зимин Михаил\OneDrive\Рабочий стол\hello world\capybaraWebsite\server.js"

{
  const TelegramBot = require("node-telegram-bot-api");
  const WebSocket = require("ws");
  const token = "6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo";

  const bot = new TelegramBot(token, { polling: true });
  const wss = new WebSocket.Server({ port: 8080 });

  const { MongoClient } = require("mongodb");

  wss.on("connection", (ws) => {
    console.log("Установлено новое WebSocket соединение");
    ws.on("message", async (message) => {
      // console.log('Получено сообщение из WebSocket:', message);

      // if (message === 'get_posts') { // Пример запроса на получение данных

      // }
      try {
        const client = new MongoClient(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        await client.connect();
        const db = client.db("mydatabase");
        const collection = db.collection("posts");
        const posts = await collection.find({}).toArray();

        console.log("------posts: ", posts);

        client.close();

        ws.send(JSON.stringify(posts)); // Отправляем данные клиенту
      } catch (error) {
        console.error("Ошибка при получении данных из базы данных:", error);
      }
    });
  });

  wss.on("error", (error) => {
    console.error("WebSocket сервер: произошла ошибка", error);
  });

  bot.on("message", (msg) => {
    const messageData = msg;
    console.log("Получено сообщение из tg:", messageData);
    const messageDataString = JSON.stringify(messageData);

    // wss.clients.forEach((client) => {
    //   client.send(messageDataString);
    // });

    bot.sendMessage(msg.chat.id, "Получено");
    saveDataToDatabase(messageData); // Вызов функции сохранения данных
  });

  const uri =
    "mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/mydatabase";

  async function saveDataToDatabase(data) {
    try {
      const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      // Подключение к базе данных
      await client.connect();

      // Выполнение операций с базой данных
      const db = client.db("mydatabase");
      const collection = db.collection("posts");

      await collection.insertOne(data);

      // console.log('Сохранено сообщение из WebSocket:', collection);
      // console.log('-----db:', db);
      // console.log('-----data:', data);

      // Закрытие соединения с базой данных
      client.close();
    } catch (error) {
      console.error("Ошибка при сохранении данных в базу данных:", error);
    }
  }

  module.exports = { saveDataToDatabase };
}

// //node "C:\Users\Зимин Михаил\OneDrive\Рабочий стол\hello world\capybaraWebsite\server.js"

// {
//   const TelegramBot = require("node-telegram-bot-api");
//   const WebSocket = require("ws");
//   const token = "6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo";

//   const bot = new TelegramBot(token, { polling: true });
//   const wss = new WebSocket.Server({ port: 8080 });

//   const { MongoClient } = require("mongodb");

//   wss.on("connection", (ws) => {
//     console.log("Установлено новое WebSocket соединение");
//     ws.on("message", async (message) => {
//       // console.log('Получено сообщение из WebSocket:', message);

//       // if (message === 'get_posts') { // Пример запроса на получение данных

//       // }
//       try {
//         const client = new MongoClient(uri, {
//           useNewUrlParser: true,
//           useUnifiedTopology: true,
//         });
//         await client.connect();
//         const db = client.db("mydatabase");
//         const collection = db.collection("posts");
//         const posts = await collection.find({}).toArray();

//         console.log("------posts: ", posts);
//         client.close();

//         ws.send(JSON.stringify(posts)); // Отправляем данные клиенту
//       } catch (error) {
//         console.error("Ошибка при получении данных из базы данных:", error);
//       }
//     });
//   });

//   wss.on("error", (error) => {
//     console.error("WebSocket сервер: произошла ошибка", error);
//   });

//   bot.on("message", (msg) => {
//     const messageData = msg;
//     console.log("Получено сообщение из tg:", messageData);
//     const messageDataString = JSON.stringify(messageData);

//     // wss.clients.forEach((client) => {
//     //   client.send(messageDataString);
//     // });

//     bot.sendMessage(msg.chat.id, "Получено");
//     saveDataToDatabase(messageData); // Вызов функции сохранения данных
//   });

//   const uri =
//     "mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/mydatabase";

//   async function saveDataToDatabase(data) {
//     try {
//       const client = new MongoClient(uri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       });

//       // Подключение к базе данных
//       await client.connect();

//       // Выполнение операций с базой данных
//       const db = client.db("mydatabase");
//       const collection = db.collection("posts");

//       await collection.insertOne(data);
//       client.close();
//     } catch (error) {
//       console.error("Ошибка при сохранении данных в базу данных:", error);
//     }
//   }

//   module.exports = { saveDataToDatabase };
// }

//mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/
