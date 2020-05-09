const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect('mongodb+srv://madhu_301:madhu_301_mongo@cluster0-0aj5t.mongodb.net/shop?retryWrites=true&w=majority',
  { useUnifiedTopology: true })
    .then(client => {
      _db = client.db();
      console.log('Connected!');
      callback();
    })
    .catch(err => {
      throw err;
    });
};
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
