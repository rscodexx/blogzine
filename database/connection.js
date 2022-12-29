const Sequelize = require('sequelize');

const connection = new Sequelize('blogzine', 'rafael', 'rafael', {
    host: 'localhost',
    dialect: 'mysql',
    port: 33061,
    timezone: '-03:00'
});

module.exports = connection;
