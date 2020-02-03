import Sequelize from "sequelize";
import db from "../database/db"

module.exports = db.sequelize.define(
    'users',
    {
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                msg: 'email already exists'
            },
            validate: {
                notEmpty: {
                    msg: 'phone num should not be empty'
                }
            }

        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                msg: 'email already exists'
            },
            validate: {
                isEmail: {
                    msg: 'Not a valid email'
                },
                notEmpty: {
                    msg: 'email should not be empty'
                }
            }
        }
    }
);