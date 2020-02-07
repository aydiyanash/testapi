import security from '../utils/security'
import authTokens from '../utils/authTokens'
import jwt from "jsonwebtoken";
import config from "../../config";

const { User } = require('../../models');
const { Op } = require('sequelize');


class Auth {
    static async signIn(req, res) {
        let phoneOrEmail = req.body.id;
        let password = req.body.password;

        try {

            const user = await User.findOne({
                where: {
                    [Op.or]: [
                        {phone: phoneOrEmail},
                        {email: phoneOrEmail}
                    ]
                }
            });

            if (user) {
                if (security.validatePassword(password, user.password)) {
                    const [token, refresh_token] = await authTokens.createTokens(user);
                    res.json({
                        success: true,
                        message: 'Authentication successful!',
                        token,
                        refresh_token
                    });
                } else {
                    res.sendStatus(403).json({
                        success: false,
                        message: 'Incorrect username or password'
                    });
                }
            } else {
                res.sendStatus(400).json({
                    success: false,
                    message: 'Authentication failed! Please check the request'
                });
            }

        } catch (e) {
            console.log(e, 'e');
            res.json({
                success: false,
                message: e
            })
        }
    }

    static async signUp(req, res) {
        if (!req.body.id || !req.body.password) {
            res.json({
                success: false,
                message: 'check request'
            });
            return
        }

        let id = req.body.id;
        const record = {};
        if (id.search("@") !== -1) {
            // id is email
            record.email = id;
        } else {
            record.phone = id;
        }

        record.password = req.body.password;
        console.log(record, 'record');

        try {
            const user = await User.create(record);
            const [token, refresh_token] = await authTokens.createTokens(user);

            res.json({
                success: true,
                message: "happy signup!",
                token,
                refresh_token
            })
        } catch (e) {
            res.json({
                success: false,
                message: e.errors[0].message
            })
        }
    }

    static async newToken(req, res) {
        const bearerToken = req.token;
        const refreshToken = req.body.refresh_token;
        const response = await authTokens.refreshTokens(bearerToken, refreshToken, res);
        res.json(response);
    }
}


module.exports = Auth;