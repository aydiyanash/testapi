import jwt from "jsonwebtoken";
import config from "../../config";

class TokenHandler {
    login (req, res) {
        let id = req.body.id;
        let password = req.body.password;
        // For the given username fetch user from DB

        let mockedUsername = 'admin';
        let mockedPassword = 'password';

        if (username && password) {
            if (username === mockedUsername && password === mockedPassword) {
                let token = jwt.sign({username: username},
                    config.secret,
                    { expiresIn: '10m'
                    }
                );
                res.json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token
                });
            } else {
                res.send(403).json({
                    success: false,
                    message: 'Incorrect username or password'
                });
            }
        } else {
            res.send(400).json({
                success: false,
                message: 'Authentication failed! Please check the request'
            });
        }
    }
    index (req, res) {
        res.json({
            success: true,
            message: 'Index page'
        });
    }
}

module.exports = TokenHandler;