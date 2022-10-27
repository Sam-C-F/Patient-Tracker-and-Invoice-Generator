import { response } from "express";
import { string } from "pg-format";
import { Patient } from "../controllers/patients.controller";

import db from "../db/index";

export const fetchPatients: (search: string) => Promise<Patient[]> = (
  search
) => {
  let queryString = `SELECT patient_id, reports.patient_name, TO_CHAR(dob, 'DD-MM-YYYY') AS dob, reference, solicitors.name AS solicitor
  FROM reports JOIN solicitors
  ON reports.solicitor_id = solicitors.solicitor_id`;
  const queryValues = [];
  if (search) {
    search = search.toLowerCase();
    queryString += ` WHERE LOWER(reports.patient_name) LIKE $1`;
    queryValues.push(`%${search}%`);
  }
  return db
    .query(queryString, queryValues)
    .then(({ rows }: { rows: Patient[] }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "Patient not found." });
      } else {
        return rows;
      }
    });
};

export const addPatient: (
  reference: string,
  name: string,
  dob: string,
  solicitor_id: number
) => Promise<Patient> = async (reference, name, dob, solicitor_id) => {
  const insertPatient = await db.query(
    `
  INSERT INTO reports
  (reference, patient_name, dob, solicitor_id)
  VALUES
  ($1, $2, $3, $4)
  RETURNING *;
  `,
    [reference, name, dob, solicitor_id]
  );
  const { rows } = await db.query(`
  SELECT patient_id, reports.patient_name, TO_CHAR(dob, 'DD-MM-YYYY') AS dob, reference, solicitors.name AS solicitor, location
  FROM reports JOIN solicitors
  ON reports.solicitor_id = solicitors.solicitor_id
  WHERE reports.patient_id = ${insertPatient.rows[0].patient_id};
    `);
  return rows[0];
};
