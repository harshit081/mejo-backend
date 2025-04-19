require('dotenv').config();
console.log(process.env.DB_HOST)
module.exports = {
    email_user: process.env.EMAIL_USER,
    email_password: process.env.EMAIL_PASSWORD,
    db: {
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
    },
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT || 5000,
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mejo_content'
    },
};
