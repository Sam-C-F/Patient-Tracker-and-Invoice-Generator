import express from "express";
import { internalServerError } from "./src/controllers/errors.controller";

const app = express();

app.use(internalServerError);
