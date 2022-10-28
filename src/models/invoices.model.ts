import { Invoice } from "../controllers/invoices.controller";

import db from "../db/index";

export const fetchInvoices: () => Promise<Invoice[]> = async () => {
  const { rows } = await db.query(
    `
  SELECT reference, reports.patient_name, invoice_number, TO_CHAR(created_at, 'DD/MM/YYYY') AS date, description, hours_worked, hourly_rate, name AS solicitor_name, address
  FROM reports JOIN invoices
  ON invoices.patient_id = reports.patient_id
  JOIN solicitors ON reports.solicitor_id = solicitors.solicitor_id;
    `
  );
  return rows;
};

export const addInvoice: (
  desciption: string,
  hours_worked: number,
  hourly_rate: number,
  patient_id: number
) => Promise<Invoice> = async (
  description,
  hours_worked,
  hourly_rate,
  patient_id
) => {
  if (
    /[^a-zA-Z_ ]/g.test(description) ||
    !description ||
    !hourly_rate ||
    !hours_worked ||
    !patient_id
  ) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const { rows } = await db.query(
    `
  INSERT INTO invoices
  (description, hours_worked, hourly_rate, patient_id)
  VALUES
  ($1, $2, $3, $4)
  RETURNING invoice_number; 
    `,
    [description, hours_worked, hourly_rate, patient_id]
  );
  const invoice = await db.query(
    `
  SELECT reference, reports.patient_name, invoice_number, TO_CHAR(created_at, 'DD/MM/YYYY') AS date, description, hours_worked, hourly_rate, name AS solicitor_name, address
  FROM reports JOIN invoices
  ON invoices.patient_id = reports.patient_id
  JOIN solicitors ON reports.solicitor_id = solicitors.solicitor_id
  WHERE invoices.invoice_number = $1;
  `,
    [rows[0].invoice_number]
  );
  return invoice.rows[0];
};
