import express from "express";
import { fetchInvoices } from "../models/invoices.model";

export type Invoice = {
  reference: string;
  patient_name: string;
  invoice_number: number;
  date: string;
  description: string;
  hours_worked: number;
  hourly_rate: number;
  solicitor_name: string;
  address: string;
};

export const getInvoices: express.RequestHandler<
  {},
  { invoices: Invoice[] },
  {}
> = async (req, res, next) => {
  try {
    const invoices = await fetchInvoices();
    res.status(200).send({ invoices });
  } catch (err) {
    next(err);
  }
};
