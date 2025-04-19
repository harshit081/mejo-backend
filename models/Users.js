const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Import the sequelize instance

const Users = sequelize.define('users', {
    id: {
        type: DataTypes.UUID, // Use UUID for primary key
        defaultValue: DataTypes.UUIDV4, // Automatically generate UUID v4
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure emails are unique
        validate: {
            isEmail: true // Validate email format
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, // Password is required
    },
    isVerified: {  // Add this field
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    tableName: 'users', // Explicitly specify the table name
});

module.exports = Users;
