require('dotenv').config({ path: `${process.cwd()}/.env` });

const dbUser = process.env.DB_USER || process.env.DB_USERNAME || process.env.USER;
const dbPassword = process.env.DB_PASSWORD || process.env.PASSWORD;
const dbName = process.env.DB_NAME || process.env.DB;
const dbHost = process.env.DB_HOST || process.env.HOST;
const dbPort = process.env.DB_PORT || process.env.PORT;

module.exports = {
    development: {
        username: dbUser,
        password: dbPassword,
        database: dbName,
        host: dbHost,
        port: dbPort,
        dialect: 'postgres',
        seederStorage: 'sequelize',
    },
    test: {
        username: 'root',
        password: null,
        database: 'database_test',
        host: '127.0.0.1',
        dialect: 'mysql',
    },
    production: {
        username: dbUser,
        password: dbPassword,
        database: dbName,
        host: dbHost,
        port: dbPort,
        dialect: 'postgres',
    },
};