//node "C:\Users\Зимин Михаил\OneDrive\Рабочий стол\hello world\capybaraWebsite\server.js"

{
  const TelegramBot = require("node-telegram-bot-api");
  const WebSocket = require("ws");
  const token = "6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo";

  const bot = new TelegramBot(token, { polling: true });
  const wss = new WebSocket.Server({ port: 3000 });

  const { MongoClient } = require("mongodb");

  wss.on("connection", (ws) => {
    console.log("Установлено новое WebSocket соединение");
    ws.on("message", async (message) => {
      //console.log("Получено сообщение из WebSocket:", message.toString());
      //const data = JSON.parse(message);
      console.log("----data:", JSON.parse(message));
      try {
        const data = JSON.parse(message);
        // Пример запроса на получение данных
        const client = new MongoClient(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        await client.connect();
        const db = client.db("mydatabase");
        const collection = db.collection("posts");

        if (data.action === "get_posts") {
          console.log("get_posts");

          const posts = await collection.find({}).toArray();

          //console.log("Посты из базы данных: ", posts);

          client.close();

          ws.send(JSON.stringify(posts)); // Отправляем данные клиенту
        } else if (data.action === "add_comment") {
          console.log("add_comment");

          const post = await collection.findOne({ id: data.postId });

          if (post) {
            // Добавьте комментарий к массиву комментариев поста
            post.comments.push(data.comment);

            // Обновите пост в базе данных
            await collection.updateOne({ id: data.postId }, { $set: post });

            const posts = await collection.find({}).toArray();
            ws.send(JSON.stringify(posts));

            console.log("Комментарий добавлен к посту:", post);
          }

          client.close();
        } else if (data.action === "like") {
          console.log("like station", data.type);

          const post = await collection.findOne({ id: data.postId });

          //console.log("like post: ", post);

          if (data.type === "add") {
            // Увеличиваем количество лайков
            post.likes += 1;
          } else if (data.type === "remove") {
            // Уменьшаем количество лайков, если оно больше 0
            if (post.likes > 0) {
              post.likes -= 1;
            }
          }

          await collection.updateOne({ id: data.postId }, { $set: post });

          const posts = await collection.find({}).toArray();
          ws.send(JSON.stringify(posts));

          client.close();
        } else {
          console.log("Неверное действие:", data.action);
        }

        // wss.clients.forEach((client) => {
        //   client.send(updatedPostData);
        // });
      } catch (error) {
        console.error("Ошибка при получении данных из базы данных:", error);
        console.error("Ошибка при парсинге JSON:", error);
      }
    });
  });

  wss.on("error", (error) => {
    console.error("WebSocket сервер: произошла ошибка", error);
  });

  bot.on("message", (msg) => {
    const messageData = msg;
    console.log("Получено сообщение из tg:", messageData);

    //const messageDataString = JSON.stringify(messageData);
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

      const message = data.text;

      let name, url, messageText;

      const regex = /([^]+) \n([^ \n]+) \n([^]+)/;

      if (data.reply_to_message) {
        const replyMessage = data.reply_to_message;
        const replyText = replyMessage.text;

        [, name, url, messageText] = replyText.match(regex);
      } else {
        const matchResult = message.match(regex);
        if (matchResult) {
          [, name, url, messageText] = matchResult;
        }
      }

      var postDB = {
        id: data.date,
        name: name,
        url: url,
        messageText: messageText,
        likes: 0,
        comments: [],
        timestamp: data.date,
      };

      await collection.insertOne(postDB);

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
//   const wss = new WebSocket.Server({ port: 3000 });

//   const { MongoClient } = require("mongodb");

//   wss.on("connection", (ws) => {
//     console.log("Установлено новое WebSocket соединение");
//     ws.on("message", async (message) => {
//       //console.log("Получено сообщение из WebSocket:", message.toString());
//       //const data = JSON.parse(message);
//       // console.log("----data:", data);
//       try {
//         const data = JSON.parse(message);
//         // Пример запроса на получение данных
//         const client = new MongoClient(uri, {
//           useNewUrlParser: true,
//           useUnifiedTopology: true,
//         });
//         await client.connect();
//         const db = client.db("mydatabase");
//         const collection = db.collection("posts");

//         if (data.action === "get_posts") {
//           console.log("get_posts");

//           const posts = await collection.find({}).toArray();

//           //console.log("Посты из базы данных: ", posts);

//           client.close();

//           ws.send(JSON.stringify(posts)); // Отправляем данные клиенту
//         } else if (data.action === "add_comment") {
//           console.log("add_comment");

//           const post = await collection.findOne({ id: data.postId });

//           if (post) {
//             // Добавьте комментарий к массиву комментариев поста
//             post.comments.push(data.comment);

//             // Обновите пост в базе данных
//             await collection.updateOne({ id: data.postId }, { $set: post });

//             console.log("Комментарий добавлен к посту:", post);
//           }

//           client.close();
//         } else if (data.action === "like") {
//           console.log("like");

//           const postId = data.postId;
//           const post = await collection.findOne({ id: postId });

//           if (data.type === "add") {
//             // Увеличиваем количество лайков
//             post.likes += 1;
//           } else if (data.type === "remove") {
//             // Уменьшаем количество лайков, если оно больше 0
//             if (post.likes > 0) {
//               post.likes -= 1;
//             }
//           }

//           wss.clients.forEach((client) => {
//             client.send(updatedPostData);
//           });

//           client.close();
//         } else {
//           console.log("Неверное действие:", data.action);
//         }
//       } catch (error) {
//         console.error("Ошибка при получении данных из базы данных:", error);
//         console.error("Ошибка при парсинге JSON:", error);
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

//       const message = data.text;

//       let name, url, messageText;

//       const regex = /([^]+) \n([^ \n]+) \n([^]+)/;

//       if (data.reply_to_message) {
//         const replyMessage = data.reply_to_message;
//         const replyText = replyMessage.text;

//         [, name, url, messageText] = replyText.match(regex);
//       } else {
//         const matchResult = message.match(regex);
//         if (matchResult) {
//           [, name, url, messageText] = matchResult;
//         }
//       }

//       var postDB = {
//         id: data.date,
//         name: name,
//         url: url,
//         messageText: messageText,
//         likes: 0,
//         comments: [],
//         timestamp: data.date,
//       };

//       await collection.insertOne(postDB);

//       client.close();
//     } catch (error) {
//       console.error("Ошибка при сохранении данных в базу данных:", error);
//     }
//   }

//   module.exports = { saveDataToDatabase };
// }
