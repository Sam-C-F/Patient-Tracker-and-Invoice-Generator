import express from "express";
import {
  badRequestErrors,
  internalServerError,
  PSQLErrors,
} from "./controllers/errors.controller";
import {
  getPatientById,
  getPatients,
  postPatient,
} from "./controllers/patients.controller";
import {
  getSolicitors,
  postSolicitors,
} from "./controllers/solicitors.controller";

const app = express();
app.use(express.json());

app.get("/api/patients", getPatients);
app.post("/api/patients", postPatient);
app.get("/api/patients/:patient_id", getPatientById);

app.get("/api/solicitors", getSolicitors);
app.post("/api/solicitors", postSolicitors);

app.use(PSQLErrors);

app.use(badRequestErrors);

app.use(internalServerError);

export default app;
