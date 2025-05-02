const { Sequelize } = require("sequelize");
const config = require("./config");

let sequelize;

// Create a singleton pattern to reuse connection
if (!global.sequelize) {
  global.sequelize = new Sequelize(config.db.connectionString, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 2, // Reduce connection pool for serverless
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

sequelize = global.sequelize;

module.exports = { sequelize };
