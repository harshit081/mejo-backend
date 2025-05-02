require('dotenv').config();

module.exports = {
    email_user: process.env.EMAIL_USER,
    email_password: process.env.EMAIL_PASSWORD,
    db: {
        connectionString: process.env.POSTGRES_SUPABASE_CONNECT_URL,
    },
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT || 5000,
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mejo_content'
    },
};
