import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import middleware from "./middleware";
import TokenHandler from "./src/utils/tokenHandler"

const app = express();
const handlers = new TokenHandler();
const port = 4000;

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', middleware.checkToken, handlers.index);
app.listen(port, () => console.log(`Server is listening on port: ${port}`));