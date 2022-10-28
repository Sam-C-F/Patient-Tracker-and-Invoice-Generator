import { Solicitor } from "../controllers/solicitors.controller";

import db from "../db/index";

export const fetchSolicitors: () => Promise<Solicitor[]> = async () => {
  const { rows } = await db.query(`
  SELECT * FROM solicitors
  ORDER BY name;
  `);
  return rows;
};
