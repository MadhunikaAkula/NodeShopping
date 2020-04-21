// const mysql = require('mysql2');
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'shopping-cart',
//     password: 'admin'
// });     
//sql need to create pool to manage connections for each query.
//sequelize object will automatically create pool on intialization .

const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-shopping', 'root', 'admin', {
    dialect: 'mysql',
    host: 'localhost'
})
module.exports = sequelize;