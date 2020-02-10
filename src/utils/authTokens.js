import jwt from 'jsonwebtoken'
import config from "../../config"
import blacklist from  'express-jwt-blacklist'

const { User } = require('../../models');
const crypto = require("crypto");


class authTokens {
    static async createTokens(user) {
        const createToken = jwt.sign(
            {
                user: user.email || user.phone,
                id: user.id,
                sub: crypto.randomBytes(16).toString("hex")
            },
            config.secret,
            {
                expiresIn: '10m',
            },
        );

        const createRefreshToken = jwt.sign(
            {
                user: user.email || user.phone,
                id: user.id
            },
            config.refreshSecret,
            {
                expiresIn: '7d',
            },
        );

        return Promise.all([createToken, createRefreshToken]);
    }

    static async refreshTokens(refreshToken,res){
        let userId = -1;
        try {
            jwt.verify(refreshToken, config.refreshSecret, (err, decoded) => {
                if(err){
                    return res.json({
                        success: false,
                        message: err.message
                    });
                }

                userId = decoded.user.id;
            });
        } catch (err) {
            return res.json({
                success: false,
                message: err
            });
        }

        try {
            const user = await User.findOne({
                where: {
                    id: userId
                }
            });
            const [newToken, newRefreshToken] = await this.createTokens(user);
            return {
                token: newToken,
                refreshToken: newRefreshToken,
            };
        }
        catch (e) {
            return res.json({
                success: false,
                message: e.message
            });
        }
    }
    
    static revokeToken (user) {
        blacklist.revoke(user);
    }
}

module.exports = authTokens;