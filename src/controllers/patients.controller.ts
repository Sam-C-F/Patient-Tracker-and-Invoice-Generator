import express from "express";

import { fetchPatients } from "../models/patients.model";

export type Patient = {
  reference: string;
  patient_name: string;
  dob: string;
  solicitor: string;
  location: string;
};

export const getPatients: express.RequestHandler<{
  patients: Patient[];
}> = async (req, res, next) => {
  try {
    const patients = await fetchPatients();
    res.status(200).send({ patients });
  } catch (err) {
    next(err);
  }
};
