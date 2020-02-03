import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import middleware from "./middleware";
import routes from "./src/routes/routes.js";

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

routes.routes(app, middleware);

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
