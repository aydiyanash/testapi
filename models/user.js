'use strict';
import Security from "../src/utils/security";

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: {
                msg: "phone number exists"
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: {
                msg: "email exists"
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {});

    User.addHook('beforeSave', async (user) => {
      if (user.isNewRecord || user.changed('password')) {
        user.password = await Security.generatePasswordHash(user.password);
      }
    });

    return User;
};