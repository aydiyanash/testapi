import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import middleware from "./middleware";
import routes from "./src/routes/routes.js";
import Database from "./databaseInit"

const database = new Database();
const app = express();
const port = 4000;


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