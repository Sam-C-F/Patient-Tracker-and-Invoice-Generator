import express from "express";
import {
  badRequestErrors,
  internalServerError,
  PSQLErrors,
} from "./controllers/errors.controller";

import apiRouter from "./routers/api.router";

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use(PSQLErrors);

app.use(badRequestErrors);

app.use(internalServerError);

export default app;
