import Sequelize from "sequelize";
import db from "../database/db"

const User = db.sequelize.define(
    'users',
    {
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: {
                msg: 'email already exists'
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: {
                msg: 'email already exists'
            },
            validate: {
                isEmail: {
                    msg: 'Not a valid email'
                }
            }
        },
        password : {
            type : Sequelize.STRING,
            allowNull: false

        },
    }
);


function generateHash(user) {
    if (user === null) {
        throw new Error('User not found');
    }
    else if (!user.changed('password')) return user.password;
    else {
        return user.password = user.password && user.password !== "" ? bcrypt.hashSync(user.password, 10) : "";
    }
}

User.beforeCreate(generateHash);
User.beforeUpdate(generateHash);

module.exports = User;
