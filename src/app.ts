import express from "express";
import {
  badRequestErrors,
  internalServerError,
  PSQLErrors,
} from "./controllers/errors.controller";
import cors from "cors";

const app = express();
app.use(cors());

import apiRouter from "./routers/api.router";

app.use(express.json());

app.use("/api", apiRouter);

app.use(PSQLErrors);

app.use(badRequestErrors);

app.use(internalServerError);

export default app;
