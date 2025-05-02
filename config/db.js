const { Sequelize } = require("sequelize");
const config = require("./config");

let sequelize;

try {
  // Check if connectionString exists and is valid
  if (!config.db || !config.db.connectionString) {
    console.warn('PostgreSQL connection string not provided');
    sequelize = null;
  } else {
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
        },
        retry: {
          max: 3 // Retry connection up to 3 times
        }
      });
    }

    sequelize = global.sequelize;
  }
} catch (error) {
  console.error("PostgreSQL initialization error:", error);
  sequelize = null;
}

module.exports = { sequelize };
