import patientsRouter from "./patients.router";

import express from "express";
import solicitorsRouter from "./solicitors.router";
import invoicesRouter from "./invoices.router";

const apiRouter = express.Router();

apiRouter.use("/patients", patientsRouter);

apiRouter.use("/solicitors", solicitorsRouter);

apiRouter.use("/invoices", invoicesRouter);

export default apiRouter;
