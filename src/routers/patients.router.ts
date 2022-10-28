import express from "express";

import {
  getPatientById,
  getPatients,
  postPatient,
} from "../controllers/patients.controller";

const patientsRouter = express.Router();

patientsRouter.get("/", getPatients);

patientsRouter.post("/", postPatient);

patientsRouter.get("/:patient_id", getPatientById);

export default patientsRouter;
