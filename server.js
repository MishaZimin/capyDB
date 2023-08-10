//node "C:\Users\Зимин Михаил\OneDrive\Рабочий стол\hello world\capybaraWebsite\server.js"

{  
  const TelegramBot = require('node-telegram-bot-api');
  const WebSocket = require('ws');
  const token = '6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo';
  
  const bot = new TelegramBot(token, { polling: true });
  const wss = new WebSocket.Server({ port: 8080 });

  const { MongoClient } = require('mongodb');
  
  
  wss.on('connection', (ws) => {
    console.log('Установлено новое WebSocket соединение');
    ws.on('message', async (message) => {
      console.log('Получено сообщение из WebSocket:', message);

      // if (message === 'get_posts') { // Пример запроса на получение данных
        
      // }
      try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db('mydatabase');
        const collection = db.collection('posts');
        const posts = await collection.find({}).toArray();

        console.log('------posts: ', posts);

        client.close();

        ws.send(JSON.stringify(posts)); // Отправляем данные клиенту
      } catch (error) {
        console.error('Ошибка при получении данных из базы данных:', error);
      }
    });
  });

  wss.on('error', (error) => {
    console.error('WebSocket сервер: произошла ошибка', error);
  });
  
  
  bot.on('message', (msg) => {
    const messageData = msg;
    console.log('Получено сообщение из tg:', messageData);
    const messageDataString = JSON.stringify(messageData);
    wss.clients.forEach((client) => {
      client.send(messageDataString, (error) => {
        if (error) {
          console.error('Ошибка при отправке сообщения через WebSocket:', error);
        }
      });
    });
  
    saveDataToDatabase(messageData); // Вызов функции сохранения данных
    bot.sendMessage(msg.chat.id, 'Получено');
  });


const uri = 'mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/mydatabase';

async function saveDataToDatabase(data) {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Подключение к базе данных
    await client.connect();

    // Выполнение операций с базой данных
    const db = client.db('mydatabase');
    const collection = db.collection('posts');
    
    await collection.insertOne(data);

    // console.log('Сохранено сообщение из WebSocket:', collection);
    // console.log('-----db:', db);
    // console.log('-----data:', data);

    // Закрытие соединения с базой данных
    client.close();
  } catch (error) {
    console.error('Ошибка при сохранении данных в базу данных:', error);
  }
}

module.exports = { saveDataToDatabase };
}



























//node "C:\Users\Зимин Михаил\OneDrive\Рабочий стол\hello world\capybaraWebsite\server.js"

// {  
//   const TelegramBot = require('node-telegram-bot-api');
//   const WebSocket = require('ws');
//   const token = '6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo';

//   const express = require('express');
//   const mongoose = require('mongoose');
//   const bodyParser = require('body-parser');
//   const cors = require('cors');
  
//   const { MongoClient } = require('mongodb');

//   const bot = new TelegramBot(token, { polling: true });
//   const wss = new WebSocket.Server({ port: 8080 });

//   const app = express();
//   const port = process.env.PORT || 3000;

//   app.use(bodyParser.json());
//   app.use(cors());
  
//   // Подключение к MongoDB
//   mongoose.connect('mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });

//   // // Подключение к MongoDB
//   // mongoose.connect('mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/', {
//   //   useNewUrlParser: true,
//   //   useUnifiedTopology: true
//   // });

  
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'Ошибка подключения к MongoDB:'));
// db.once('open', () => {
//   console.log('Успешное подключение к MongoDB');
// });
  


// // Определение схемы и модели данных
// const postSchema = new mongoose.Schema({
//   name: String,
//   url: String,
//   messageText: String,
//   likes: Number,
//   timestamp: Number
// });



// const Post = mongoose.model('Post', postSchema);

// // Маршруты
// app.get('/posts', async (req, res) => {
//   try {
//     const agg = []; // Ваши этапы агрегации
//     const client = await MongoClient.connect(
//       'mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/',
//       { useNewUrlParser: true, useUnifiedTopology: true }
//     );
//     const coll = client.db('test').collection('posts');
//     const cursor = coll.aggregate(agg);
//     const result = await cursor.toArray();
//     await client.close();

//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error: 'Ошибка при получении постов' });
//   }
// });

// // Маршрут для получения постов
// app.get('/posts', async (req, res) => {
//   try {
//     const posts = await Post.find({}, { __v: 0 }); // Исключаем поле __v
//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(500).json({ error: 'Ошибка при получении постов' });
//   }
// });

// // Запуск сервера
// app.listen(port, () => {
//   console.log(`Сервер запущен на порту ${port}`);
// });

// wss.on('connection', (ws) => {
//   console.log('Установлено новое WebSocket соединение');
//   ws.on('message', (message) => {
//     console.log('Получено сообщение из WebSocket:', message);
//   });
// });

// bot.on('message', (msg) => {
//   const messageData = msg;
//   console.log('Получено сообщение:', messageData);

//   saveMessageToMongoDB(messageData);


//   // Отправляем сообщение через WebSocket
//   wss.clients.forEach((client) => {
//     client.send(JSON.stringify(messageData));
//   });

//   bot.sendMessage(chat.id, 'Получено');
// });
    
// async function saveMessageToMongoDB(messageData) {
//     try {
//       const { chat, text, from, date, reply_to_message } = messageData;
//       const { id, first_name, last_name, username } = from;
//       const { id: chatId, type } = chat;
  
//       let name, url, messageText;
  
//       if (reply_to_message) {
//         // Если есть пересланное сообщение, извлекаем данные из него
//         const { text: replyText } = reply_to_message;
//         const regex = /([^]+) \n([^ \n]+) \n([^]+)/;
//         [, name, url, messageText] = replyText.match(regex);
//       } else {
//         // Если пересланного сообщения нет, используем данные текущего сообщения
//         const regex = /([^]+) \n([^ \n]+) \n([^]+)/;
//         [, name, url, messageText] = text.match(regex);
//       }
  
//       const post = new Post({
//         name: name || (username ? `@${username}` : `${first_name} ${last_name}`),
//         url: url || `https://t.me/${type === 'private' ? 'c' : 's'}/${chatId}/${messageData.message_id}`,
//         messageText: messageText || text,
//         likes: 0,
//         timestamp: date,
//       });
  
//       await post.save({ wtimeout: 0 });
//       console.log('Сообщение успешно сохранено в базу данных.');
//     } catch (error) {
//       console.error('Ошибка при сохранении сообщения:', error);
//     }

//   }
// }


// {
// const TelegramBot = require('node-telegram-bot-api');
// const WebSocket = require('ws');
// const token = '6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo'; // Замените на свой токен

// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const { MongoClient } = require('mongodb');

// const bot = new TelegramBot(token, { polling: true });
// const wss = new WebSocket.Server({ port: 8080 });

// const app = express();
// const port = process.env.PORT || 5500;

// wss.on('connection', (ws) => {
//   console.log('Установлено новое WebSocket соединение');
//   ws.on('message', (message) => {
//     console.log('Получено сообщение из WebSocket:', message);
//   });
// });


// app.use(express.static(__dirname + '/capybaraWebsite'));

// app.use(bodyParser.json());
// app.use(cors());

// // Подключение к MongoDB
// mongoose.connect('mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'Ошибка подключения к MongoDB:'));
// db.once('open', () => {
//   console.log('Успешное подключение к MongoDB');
// });

// // Определение схемы и модели данных
// const postSchema = new mongoose.Schema({
//   name: String,
//   url: String,
//   messageText: String,
//   likes: Number,
//   timestamp: Number
// });

// const Post = mongoose.model('Post', postSchema);

// // Маршрут для получения постов из MongoDB
// app.get('http://127.0.0.1:5500/posts', async (req, res) => {
//   try {
//     const agg = []; // Ваши этапы агрегации
//     const client = await MongoClient.connect('mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/', {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     const coll = client.db('test').collection('posts');
//     const cursor = coll.aggregate(agg);
//     const result = await cursor.toArray();
//     await client.close();

//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ error: 'Ошибка при получении постов' });
//   }
// });

// // Маршрут для сохранения сообщения в MongoDB
// bot.on('message', (msg) => {
//   const messageData = msg;
//   console.log('Получено сообщение:', messageData);

//   saveMessageToMongoDB(messageData);

//   wss.clients.forEach((client) => {
//     client.send(JSON.stringify(messageData));
//   });

//   bot.sendMessage(msg.chat.id, 'Получено');
// });

// async function saveMessageToMongoDB(messageData) {
//   try {
//     // Ваш код для извлечения данных из сообщения

//     const post = new Post({
//       name: 'Example Name',
//       url: 'https://example.com',
//       messageText: 'Example Message',
//       likes: 0,
//       timestamp: Date.now()
//     });

//     await post.save({ wtimeout: 0 });
//     console.log('Сообщение успешно сохранено в базе данных.');
//   } catch (error) {
//     console.error('Ошибка при сохранении сообщения:', error);
//   }
// }

// // Запуск сервера
// app.listen(port, () => {
//   console.log(`Сервер запущен на порту ${port}`);
// });

// wss.on('connection', (ws) => {
//   console.log('Установлено новое WebSocket соединение');
//   ws.on('message', (message) => {
//     console.log('Получено сообщение из WebSocket:', message);
//   });
// });
// }






// {
//   const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(bodyParser.json());
// app.use(cors());

// // Подключение к MongoDB
// mongoose.connect('mongodb://localhost:27017/mydatabase', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'Ошибка подключения к MongoDB:'));
// db.once('open', () => {
//   console.log('Успешное подключение к MongoDB');
// });

// // Определение схемы и модели данных
// const postSchema = new mongoose.Schema({
//   name: String,
//   url: String,
//   messageText: String,
//   likes: Number,
//   timestamp: Number
// });

// const Post = mongoose.model('Post', postSchema);

// // Маршруты
// app.post('http://localhost:5500/capybaraWebsite/api/posts', async (req, res) => {
//   const { name, url, messageText, timestamp } = req.body;

//   const newPost = new Post({
//     name,
//     url,
//     messageText,
//     likes: 0,
//     timestamp
//   });

//   try {
//     await newPost.save();
//     res.status(201).json({ message: 'Пост успешно сохранен' });
//   } catch (error) {
//     res.status(500).json({ error: 'Ошибка при сохранении поста' });
//   }
// });

// // Запуск сервера
// app.listen(port, () => {
//   console.log(`Сервер запущен на порту ${port}`);
// });

// }








// const TelegramBot = require('node-telegram-bot-api');
// const WebSocket = require('ws');
// const http = require('http');
// const mongoose = require('mongoose');

// const token = '6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo';
// const bot = new TelegramBot(token, { polling: true });
// const wss = new WebSocket.Server({ port: 8080 });

// // Подключение к MongoDB
// mongoose.connect('mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// // Определение схемы и модели для постов
// const postSchema = new mongoose.Schema({
//   name: String,
//   url: String,
//   messageText: String,
//   likes: Number,
//   timestamp: Number,
// });

// const Post = mongoose.model('Post', postSchema);

// wss.on('connection', (ws) => {
//   console.log('Установлено новое WebSocket соединение');
//   ws.on('message', (message) => {
//     console.log('Получено сообщение из WebSocket:', message);
//   });
// });

// bot.on('message', (msg) => {
//   const messageData = msg;
//   console.log('Получено сообщение:', messageData);
//   const messageDataString = JSON.stringify(messageData);
//   wss.clients.forEach((client) => {
//     client.send(messageDataString);
//   });

//   // Сохраняем данные в MongoDB
//   saveMessageToMongoDB(msg);

//   bot.sendMessage(msg.chat.id, 'Получено');
// });

// // Функция для сохранения сообщений в MongoDB
// async function saveMessageToMongoDB(messageData) {
//   try {
//     const { chat, text, from, date, reply_to_message } = messageData;
//     const { id, first_name, last_name, username } = from;
//     const { id: chatId, type } = chat;

//     let name, url, messageText;

//     if (reply_to_message) {
//       // Если есть пересланное сообщение, извлекаем данные из него
//       const { text: replyText } = reply_to_message;
//       const regex = /([^]+) \n([^ \n]+) \n([^]+)/;
//       [, name, url, messageText] = replyText.match(regex);
//     } else {
//       // Если пересланного сообщения нет, используем данные текущего сообщения
//       const regex = /([^]+) \n([^ \n]+) \n([^]+)/;
//       [, name, url, messageText] = text.match(regex);
//     }

//     const post = new Post({
//       name: name || (username ? `@${username}` : `${first_name} ${last_name}`),
//       url: url || `https://t.me/${type === 'private' ? 'c' : 's'}/${chatId}/${messageData.message_id}`,
//       messageText: messageText || text,
//       likes: 0,
//       timestamp: date,
//     });

//     await post.save({ wtimeout: 0 });
//     console.log('Сообщение успешно сохранено в базу данных.');
//   } catch (error) {
//     console.error('Ошибка при сохранении сообщения:', error);
//   }
// }





// // Создаем HTTP сервер
// const server = http.createServer((req, res) => {
//   // Middleware для разрешения CORS
//   res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');

//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   // Обрабатываем запросы здесь
//   if (req.method === 'GET' && req.url === 'http://localhost:5500/capybaraWebsite/api/posts') {
//     // Возвращаем список постов из MongoDB при запросе /api/posts
//     Post.find()
//       .then((posts) => {
//         res.setHeader('Content-Type', 'application/json');
//         res.end(JSON.stringify(posts));
//       })
//       .catch((error) => {
//         console.error('Ошибка при получении постов из MongoDB:', error);
//         res.writeHead(500, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ error: 'Ошибка при получении постов из MongoDB' }));
//       });
//   } else {
//     // Возвращаем 404 Not Found для всех других запросов
//     res.writeHead(404, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ error: 'Not Found' }));
//   }
// });

// // Запускаем сервер на порту 3000 (или любом другом порту по вашему выбору)
// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`Сервер запущен на порту ${PORT}`);
// });







// const TelegramBot = require('node-telegram-bot-api');
// const WebSocket = require('ws');
// const mongoose = require('mongoose');

// const token = '6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo';
// const bot = new TelegramBot(token, { polling: true });
// const wss = new WebSocket.Server({ port: 8080 });

// // Подключение к MongoDB
// mongoose.connect('mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// // Определение схемы и модели для постов
// const postSchema = new mongoose.Schema({
//   name: String,
//   url: String,
//   messageText: String,
//   likes: Number,
//   timestamp: Number,
// });

// const Post = mongoose.model('Post', postSchema);

// wss.on('connection', (ws) => {
//   console.log('Установлено новое WebSocket соединение');
//   ws.on('message', (message) => {
//     console.log('Получено сообщение из WebSocket:', message);
//   });
// });

// bot.on('message', (msg) => {
//   const messageData = msg;
//   console.log('Получено сообщение:', messageData);
//   const messageDataString = JSON.stringify(messageData);
//   wss.clients.forEach((client) => {
//     client.send(messageDataString);
//   });

//   // Сохраняем данные в MongoDB
//   saveMessageToMongoDB(msg);
  
//   bot.sendMessage(msg.chat.id, 'Получено');
// });

// // Функция для сохранения сообщений в MongoDB
// function saveMessageToMongoDB(messageData) {
//   const { chat, text, from, date } = messageData;
//   const { id, first_name, last_name, username } = from;
//   const { id: chatId, title, type } = chat;

//   const post = new Post({
//     name: username ? `@${username}` : `${first_name} ${last_name}`,
//     url: `https://t.me/${type === 'private' ? 'c' : 's'}/${chatId}/${id}`,
//     messageText: text,
//     likes: 0,
//     timestamp: date,
//   });

//   post.save((err) => {
//     if (err) {
//       console.error('Ошибка при сохранении сообщения:', err);
//     } else {
//       console.log('Сообщение успешно сохранено в базу данных.');
//     }
//   });
// }






// const TelegramBot = require('node-telegram-bot-api');
// const WebSocket = require('ws');
// const fs = require('fs');

// const token = '6392841364:AAE8PozN2Y6x0zbyjO8ei6KIRm-hUDcGyUo';

// const bot = new TelegramBot(token, { polling: true });

// const wss = new WebSocket.Server({ port: 8080 });

// wss.on('connection', (ws) => {
//   console.log('Установлено новое WebSocket соединение');

//   // Возможно, вы захотите отправить клиенту существующие посты сразу после подключения
//   // Вы можете использовать функцию send() на объекте ws для отправки данных клиенту

//   // Пример: отправка всех существующих постов из локального хранилища
//   const posts = getPostsFromLocalStorage(); // Замените эту функцию на вашу функцию для получения постов из локального хранилища
//   const postsData = JSON.stringify(posts);
//   ws.send(postsData);

//   ws.on('message', (message) => {
//     console.log('Получено сообщение из WebSocket:', message);

//     // Вам нужно обработать полученное сообщение от клиента
//     // Например, если вы хотите добавить новый пост от клиента
//     // Парсите сообщение и сохраняйте пост в локальное хранилище с помощью функции savePostToLocalStorage()

//     // Пример:
//     const post = JSON.parse(message);
//     savePostToLocalStorage(post.name, post.url, post.messageText, Date.now()); // Замените этот вызов на вашу функцию сохранения поста
//     // Опционально, отправьте новый пост всем клиентам, чтобы они обновили свои страницы
//     notifyClientsAboutNewPost(post);
//   });
// });

// bot.on('message', (msg) => {
//     const messageData = msg;
//     console.log('Получено сообщение:', messageData);

//     // Вам нужно обработать полученное сообщение от телеграм-бота
//     // Парсите сообщение и сохраняйте пост в локальное хранилище с помощью функции savePostToLocalStorage()
//     const message = messageData.text;

//     let name, url, messageText;

//     const regex = /([^ \n]+) \n([^ \n]+) \n([^]+)/;
//     if (messageData.reply_to_message) {
//         const replyMessage = messageData.reply_to_message;
//         const replyText = replyMessage.text;       
        
//         [, name, url, messageText] = replyText.match(regex);
//     } else {
//         const matchResult = message.match(regex);
//         if (matchResult) {
//         [, name, url, messageText] = matchResult;
//     }}

//     // Пример:

//     savePostToLocalStorage(name, url, messageText, Date.now()); // Замените этот вызов на вашу функцию сохранения поста

//     // Опционально, отправьте новый пост всем клиентам, чтобы они обновили свои страницы
//     notifyClientsAboutNewPost({ name, url, messageText });

//     bot.sendMessage(msg.chat.id, 'Получено');
// });

// // Ваш код для функций savePostToLocalStorage() и getPostsFromLocalStorage() здесь

// // Функция, которая сохраняет пост в локальное хранилище
// function savePostToLocalStorage(name, url, messageText, timestamp) {
//   var posts = getPostsFromLocalStorage();

//   var post = {
//     id: Date.now().toString(), // id поста
//     name: name, // имя автора
//     url: url, // url поста
//     messageText: messageText, // текст сообщения
//     likes: 0, // количество лайков
//     timestamp: timestamp // время публикации поста
//   };

//   posts.push(post);
//   savePostsToLocalStorage(posts);
// }


// // Функция, которая возвращает все посты из локального хранилища
// function getPostsFromLocalStorage() {
//   try {
//     const data = fs.readFileSync('posts.json', 'utf8');
//     return JSON.parse(data) || [];
//   } catch (error) {
//     return [];
//   }
// }

// // Функция, которая отправляет новый пост всем клиентам через WebSocket
// function notifyClientsAboutNewPost(post) {
//   const postData = JSON.stringify(post);
//   wss.clients.forEach((client) => {
//     client.send(postData, (error) => {
//       if (error) {
//         console.error('Ошибка при отправке сообщения клиенту:', error);
//       } else {
//         console.log('Сообщение успешно доставлено клиенту');
//       }
//     });
//   });
// }




// const express = require('express');
// const mongoose = require('mongoose');

// Замените <connection-string> на вашу строку подключения MongoDB Atlas
//const connectionString = 'mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/';




// const app = express();
// const port = 5050;

// // Создание схемы и модели для коллекции "posts"
// const postSchema = new mongoose.Schema({
//   name: String,
//   url: String,
//   messageText: String,
// });

// const Post = mongoose.model('Post', postSchema);

// // Подключение к MongoDB
// mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('MongoDB connected');
//     // Запуск веб-сервера после успешного подключения к MongoDB
//     app.listen(port, () => {
//       console.log(`Server started on port ${port}`);
//     });
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error:', error);
//   });

// // Загрузка данных из базы данных и передача на клиентскую сторону
// app.get('capybaraWebsite/index.html/local', async (req, res) => {
//   try {
//     // Выполнение операции нахождения всех постов в коллекции "posts"
//     const data = await Post.find().exec();
//     res.json(data); // Отправка данных на клиентскую сторону в формате JSON
//   } catch (error) {
//     console.error('Error retrieving posts:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });












