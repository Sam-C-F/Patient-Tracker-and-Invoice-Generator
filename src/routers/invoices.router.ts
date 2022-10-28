import express from "express";
import {
  getInvoiceByInvoiceId,
  getInvoices,
  getInvoicesByPatientId,
  postInvoice,
} from "../controllers/invoices.controller";

const invoicesRouter = express.Router();

invoicesRouter.get("/", getInvoices);
invoicesRouter.post("/", postInvoice);
invoicesRouter.get("/:invoice_number", getInvoiceByInvoiceId);
invoicesRouter.get("/patient/:patient_id", getInvoicesByPatientId);

export default invoicesRouter;
