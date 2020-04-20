const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'shopping-cart',
    password: 'admin'
});

module.exports = pool.promise();