const { sequelize } = require('../config/db');
const Users = require('./postgres/Users');
const OTP = require('./postgres/OTP');
const Token = require('./postgres/Token');
const PasswordReset = require('./postgres/PasswordReset');

// Define associations with proper foreign key references
OTP.belongsTo(Users, { 
    foreignKey: { 
        name: 'userid',
        type: sequelize.Sequelize.UUID,
        allowNull: false 
    }, 
    onDelete: 'CASCADE' 
});
Users.hasMany(OTP, { foreignKey: 'userid' });

Token.belongsTo(Users, { 
    foreignKey: { 
        name: 'userid',
        type: sequelize.Sequelize.UUID,
        allowNull: false 
    }, 
    onDelete: 'CASCADE' 
});
Users.hasMany(Token, { foreignKey: 'userid' });

PasswordReset.belongsTo(Users, { 
    foreignKey: { 
        name: 'userid',
        type: sequelize.Sequelize.UUID,
        allowNull: false 
    }, 
    onDelete: 'CASCADE' 
});
Users.hasMany(PasswordReset, { foreignKey: 'userid' });

module.exports = {
    sequelize,
    Users,
    OTP,
    Token,
    PasswordReset,
};
