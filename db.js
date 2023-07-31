// const { MongoClient } = require('mongodb');

// const mongoUrl = 'mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/'; // Замените на свою строку подключения

// async function connectToDatabase() {
//   const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
//   console.log('Подключено к базе данных');

//   const db = client.db('mydatabase'); // Замените на имя вашей базы данных

//   return db;
// }

// async function saveDataToDatabase(data) {
//   const db = await connectToDatabase();
//   const collection = db.collection('data'); // Замените на имя вашей коллекции

//   await collection.insertOne(data);
//   console.log('Данные сохранены в базе данных');
// }

// module.exports = {
//   saveDataToDatabase,
// };




const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/';

async function saveDataToDatabase(data) {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Подключение к базе данных
    await client.connect();

    // Выполнение операций с базой данных
    const db = client.db('mydatabase');
    const collection = db.collection('posts');
    await collection.insertOne(data);

    // Закрытие соединения с базой данных
    client.close();
  } catch (error) {
    console.error('Ошибка при сохранении данных в базу данных:', error);
  }
}

module.exports = { saveDataToDatabase };

db.js
module.exports = {
  url : 'mongodb+srv://mishaDataBase:ptNJzhp7QlM5xBiH@cluster0.0frsvu2.mongodb.net/',
};