import { Invoice } from "../controllers/invoices.controller";

import db from "../db/index";

export const fetchInvoices: () => Promise<Invoice[]> = async () => {
  const { rows } = await db.query(
    `
  SELECT reference, reports.patient_name, invoice_number, TO_CHAR(created_at, 'DD-MM-YYYY') AS date, description, hours_worked, hourly_rate, name AS solicitor_name, address
  FROM reports JOIN invoices
  ON invoices.patient_id = reports.patient_id
  JOIN solicitors ON reports.solicitor_id = solicitors.solicitor_id;
    `
  );
  return rows;
};
