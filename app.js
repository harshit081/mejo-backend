const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');

const { sequelize } = require('./config/db');
const Users = require('./models/Users');
const OTP = require('./models/OTP');
const Token = require('./models/Token');
const PasswordReset = require('./models/PasswordReset');

(async () => {
    try {
        // Synchronize all models
        await sequelize.sync({ force: false, alter: true }); // Use `{ force: true }` to drop and recreate tables
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Unable to sync the database:", error);
    }
})();

const app = express();

app.use(bodyParser.json()); // Parse incoming JSON requests

app.use('/api/auth', authRoutes);
app.get('/test',(req,res)=>{
    res.send("hello")
})

module.exports = app;
