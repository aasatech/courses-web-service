import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import morgan from "morgan";
import objection, { Model } from "objection";
import methodOverride from "method-override";
import routes from './config/routes';
import knexCofig from "./config/database";
import params from "./packages/strong-params";
import compression from "compression";
import helmet from "helmet";
import useragent from "express-useragent";

const app = express();
const environment = process.env.NODE_ENV || "development";
const db = require("knex")(knexCofig[environment]);
const env = process.env.NODE_ENV || "development";

export const port = process.env.PORT || 5000;


const logMode = app.get("env") === "development" ? "dev" : "combined";
app.use(useragent.express());
app.set("trust proxy", true);
app.use(helmet());
app.use(compression());
app.use(morgan(logMode));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      const method = req.body._method || req.query._method;
      delete req.body._method;
      return method;
    }
  })
);
app.use(express.json());
app.use(params.expressMiddleware());

app.use(express.static(path.join(__dirname, "../public")));
Model.knex(db);
routes(app);

export default app;
