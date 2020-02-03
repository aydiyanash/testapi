import jwt from "jsonwebtoken";
import config from "../../config";
import User from "../models/userModel"

const routes = (app, middleware) => {
    app.post('/signin', (req, res) => {
        let record = {};
        let provided_username = req.body.id;
        let provided_password = req.body.password;

        if ( provided_username.search("@") !== -1 ) {
            // id is email
            record.email = provided_username;
        } else {
            record.phone = provided_username;
        }

        let user = User.find(record);

        if (user) {
            if (user.password === provided_password) {
                let token = jwt.sign(
                    { username: provided_username },
                    config.secret,
                    { expiresIn: '10m' }
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

    });

    app.post('/signin/new_token', middleware.checkToken, (req, res) => {
        // middleware already checked the auth token
        // generate new token and return

        let decodedToken = req.decoded;
        let token = jwt.sign(
            {username: decodedToken.username},
            config.secret,
            { expiresIn: '10m' }
        );
        res.json({
            success: true,
            message: 'Token refreshed.',
            token: token
        });

    });

    app.post('/signup', (req, res) => {
        let record = {};

        let _id = "" + req.body.id;
        let _password = req.body.password;

        if ( _id.search("@") !== -1 ) {
            // id is email
            record.email = _id;
        } else {
            record.phone = _id;
        }
        record.password = _password;

        let user = User.create(record).then((new_user) => {

            res.json({
                success: true,
                message: "happy signup!",
                data: new_user
            })

        }).catch((error) => {
            res.json({
                success: false,
                message: error.errors
            })
        });

    });
    app.get("/", middleware.checkToken, (req, res) => {
        res.json({
            success: true,
            message: 'Welcome home!'
        });
    });


};

export default {
    routes
}
