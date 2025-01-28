const { sequelize } = require('../config/db');
const Users = require('./Users');
const OTP = require('./OTP');
const Token = require('./Token');
const PasswordReset = require('./PasswordReset');

// Define associations (if any)
OTP.belongsTo(Users, { foreignKey: 'id', onDelete: 'CASCADE' });
Users.hasMany(OTP, { foreignKey: 'id' });

Token.belongsTo(Users, { foreignKey: 'id', onDelete: 'CASCADE' });
Users.hasMany(Token, { foreignKey: 'id' });

PasswordReset.belongsTo(Users, { foreignKey: 'id', onDelete: 'CASCADE' });
Users.hasMany(PasswordReset, { foreignKey: 'id' });

// Export models and sequelize
module.exports = {
    sequelize,
    Users,
    OTP,
    Token,
    PasswordReset,
};
