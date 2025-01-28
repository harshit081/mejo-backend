const { Sequelize } = require("sequelize");
const config = require("./config");
// Create a Sequelize instance and connect to PostgreSQL
const sequelize = new Sequelize(
    config.db.name, // Database name
    config.db.user, // Database user
    config.db.password, // Database password
    {
        host: config.db.host, // Host (usually localhost)
        dialect: "postgres", // Database type
        logging: false, //
    }
);

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
