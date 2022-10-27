import express from "express";
import { internalServerError } from "./controllers/errors.controller";
import { getPatients } from "./controllers/patients.controller";

const app = express();

app.get("/api/patients", getPatients);

app.use(internalServerError);

export default app;
