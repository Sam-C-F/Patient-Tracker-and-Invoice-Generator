import express from "express";
import {
  badRequestErrors,
  internalServerError,
  PSQLErrors,
} from "./controllers/errors.controller";
import { getPatients, postPatient } from "./controllers/patients.controller";

const app = express();
app.use(express.json());

app.get("/api/patients", getPatients);
app.post("/api/patients", postPatient);

app.use(PSQLErrors);

app.use(badRequestErrors);

app.use(internalServerError);

export default app;
