import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import middleware from "./middleware";
import routes from "./src/routes/routes.js";
import Database from "./databaseInit"
import config from "./config"
import jwt from "express-jwt"
import blacklist from "express-jwt-blacklist"

const database = new Database();
const app = express();
const port = 4000;

app.use(jwt({
    secret: config.secret, isRevoked: blacklist.isRevoked
}).unless({path: ['/signin', '/signup']}));

app.use(middleware.authorizationError);
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

routes.routes(app, middleware);

const init = async () => {
    await database.init();
    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
};

init().then(resp => console.log('init done'));