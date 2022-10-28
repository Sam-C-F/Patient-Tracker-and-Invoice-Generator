import express from "express";

import {
  addPatient,
  fetchPatientById,
  fetchPatients,
} from "../models/patients.model";

export type Patient = {
  reference: string;
  patient_name: string;
  dob: string;
  solicitor: string;
  location: string;
};

export const getPatients: express.RequestHandler<
  {},
  { patients: Patient[] },
  {},
  { search: string }
> = async (req, res, next) => {
  try {
    const { search } = req.query;
    const patients = await fetchPatients(search);
    res.status(200).send({ patients });
  } catch (err) {
    next(err);
  }
};

export const postPatient: express.RequestHandler<
  {},
  { patient: Patient },
  {
    reference: string;
    patient_name: string;
    dob: string;
    solicitor_id: number;
  },
  {}
> = async (req, res, next) => {
  try {
    const { reference, patient_name, dob, solicitor_id } = req.body;
    const patient = await addPatient(
      reference,
      patient_name,
      dob,
      solicitor_id
    );
    res.status(201).send({ patient });
  } catch (err) {
    next(err);
  }
};

export const getPatientById: express.RequestHandler<
  { patient_id: number },
  {},
  { patient: Patient },
  {}
> = async (req, res, next) => {
  try {
    const { patient_id } = req.params;
    const patient = await fetchPatientById(patient_id);
    res.status(200).send({ patient });
  } catch (err) {
    next(err);
  }
};
