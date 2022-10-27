import db from "../index";
import format from "pg-format";
import formatReports from "./db-utility-func";

type SeedData = {
  invoicesData: { [key: string]: number | string | Date }[];
  reportsData: { [key: string]: number | string | Date }[];
  solicitorsData: { [key: string]: number | string | Date }[];
};

const seed = async (data: SeedData) => {
  const { invoicesData, reportsData, solicitorsData } = data;

  await db.query(`DROP TABLE IF EXISTS invoices`);
  await db.query(`DROP TABLE IF EXISTS reports`);
  await db.query(`DROP TABLE IF EXISTS solicitors`);

  return db
    .query(`DROP TABLE IF EXISTS reports;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS solicitors;`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE solicitors
    (solicitor_id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    address TEXT NOT NULL);
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE reports
        (patient_id SERIAL PRIMARY KEY,
        reference VARCHAR NOT NULL,
        patient_name VARCHAR NOT NULL,
        dob DATE,
        solicitor_id INT REFERENCES solicitors(solicitor_id));
            `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE invoices
        (invoice_number SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW(),
        description VARCHAR NOT NULL,
        hours_worked INT NOT NULL,
        hourly_rate FLOAT NOT NULL,
        patient_id INT REFERENCES reports(patient_id))
      `);
    })
    .then(() => {
      const formattedSolicitors = solicitorsData.map((solicitor) => {
        return [solicitor["name"], solicitor["location"], solicitor["address"]];
      });
      const formattedSolicitorsInsertString = format(
        `
      INSERT INTO solicitors
      (name, location, address)
      VALUES %L 
      RETURNING *;
      `,
        formattedSolicitors
      );
      return db.query(formattedSolicitorsInsertString);
    })
    .then((data: any) => {
      return formatReports(reportsData, data.rows);
    })
    .then((reportsDataWithID: any[]) => {
      const formattedReports = reportsDataWithID.map((report) => {
        return [
          report["reference"],
          report["patient_name"],
          report["dob"],
          report["solicitor_id"],
        ];
      });
      const formattedReportsInsertString = format(
        `
      INSERT INTO reports
      (reference, patient_name, dob, solicitor_id)
      VALUES %L;
      `,
        formattedReports
      );
      return db.query(formattedReportsInsertString);
    })
    .then(() => {
      const formattedInvoices = invoicesData.map((invoice) => {
        return [
          invoice["description"],
          invoice["hours_worked"],
          invoice["patient_id"],
          invoice["hourly_rate"],
        ];
      });
      const formattedInvoicesInsertString = format(
        `
        INSERT INTO invoices
        (description, hours_worked, patient_id, hourly_rate)
        VALUES %L;
        `,
        formattedInvoices
      );
      return db.query(formattedInvoicesInsertString).then(() => {});
    });
};

export default seed;
