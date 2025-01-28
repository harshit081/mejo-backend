// models/PasswordReset.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');

const PasswordReset = sequelize.define('password_resets', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

module.exports = PasswordReset;
