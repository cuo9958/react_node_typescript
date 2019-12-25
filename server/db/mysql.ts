import Sequelize from "sequelize";
import config from "config";

const dbConfig = config.db;

export const MysqlConnection = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port || 3306,
    dialect: "mysql",
    dialectOptions: {
        charset: "utf8"
    },
    pool: {
        max: dbConfig.connectionLimit,
        min: 0,
        idle: 10000
    }
});
