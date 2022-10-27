import express from "express";
import { internalServerError } from "./controllers/errors.controller";

const app = express();

app.use(internalServerError);

export default app;
