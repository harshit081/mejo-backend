const { Sequelize } = require("sequelize");
const config = require("./config");

// Create a Sequelize instance and connect to PostgreSQL
const sequelize = new Sequelize(config.db.connectionString, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

console.log("here", config);

// Test the connection
sequelize
    .authenticate()
    .then(() => {
        console.log("Database connection established successfully.");
    })
    .catch((error) => {
        console.error("Unable to connect to the database:", error);
    });

module.exports = { sequelize };
