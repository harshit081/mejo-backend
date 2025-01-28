const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Import the sequelize instance

const Token = sequelize.define('tokens', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userid: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    tableName: 'tokens', // Explicitly specify table name
});

module.exports = Token;
