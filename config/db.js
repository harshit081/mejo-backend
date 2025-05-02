const { Sequelize } = require("sequelize");
const config = require("./config");

let sequelize = null;

try {
  if (config.db && config.db.connectionString) {
    sequelize = new Sequelize(config.db.connectionString, {
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      pool: {
        max: 2,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
    
    // Test the connection but don't block app startup
    sequelize.authenticate()
      .then(() => console.log('PostgreSQL connection successful'))
      .catch(err => console.error('PostgreSQL connection error:', err));
  }
} catch (error) {
  console.error("PostgreSQL setup error:", error);
  // Don't crash the app if database setup fails
}

module.exports = { sequelize };
