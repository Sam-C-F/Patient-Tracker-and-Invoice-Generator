import express from "express";
import { addInvoice, fetchInvoices } from "../models/invoices.model";

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

export const postInvoice: express.RequestHandler<
  {},
  { invoice: Invoice },
  {
    description: string;
    hours_worked: number;
    hourly_rate: number;
    patient_id: number;
  },
  {}
> = async (req, res, next) => {
  try {
    const { description, hours_worked, hourly_rate, patient_id } = req.body;
    const invoice = await addInvoice(
      description,
      hours_worked,
      hourly_rate,
      patient_id
    );
    res.status(201).send({ invoice });
  } catch (err) {
    next(err);
  }
};
