import { Solicitor } from "../controllers/solicitors.controller";

import db from "../db/index";

export const fetchSolicitors: () => Promise<Solicitor[]> = async () => {
  const { rows } = await db.query(`
  SELECT * FROM solicitors
  ORDER BY name;
  `);
  return rows;
};

export const addSolicitor: (
  name: string,
  location: string,
  address: string
) => Promise<Solicitor> = async (name, location, address) => {
  if (
    /[^a-zA-Z_ ]/g.test(name) ||
    /[^a-zA-Z_ ]/g.test(location) ||
    !name ||
    !location ||
    !address
  ) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  const { rows } = await db.query(
    `
  INSERT INTO solicitors
  (name, location, address)
  VALUES
  ($1,$2, $3)
  RETURNING *;
  `,
    [name, location, address]
  );
  return rows[0];
};

export const fetchSolicitorById: (
  solicitor_id: number
) => Promise<Solicitor> = async (solicitor_id) => {
  const { rows } = await db.query(
    `
  SELECT * FROM solicitors
  WHERE solicitor_id = $1;
  `,
    [solicitor_id]
  );
  if (!rows[0]) {
    return Promise.reject({ status: 404, msg: "not found" });
  }
  return rows[0];
};
