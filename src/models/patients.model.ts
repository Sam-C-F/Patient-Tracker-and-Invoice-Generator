import { response } from "express";
import { Patient } from "../controllers/patients.controller";

import db from "../db/index";

export const fetchPatients: () => Promise<Patient[]> = () => {
  let queryString = `SELECT patient_id, reports.patient_name, TO_CHAR(dob, 'DD-MM-YYYY') AS dob, reference, solicitors.name AS solicitor
  FROM reports JOIN solicitors
  ON reports.solicitor_id = solicitors.solicitor_id`;

  return db.query(queryString).then(({ rows }: { rows: Patient[] }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "not found" });
    } else {
      return rows;
    }
  });
};
