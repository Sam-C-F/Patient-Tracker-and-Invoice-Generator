import express from "express";
import { addSolicitor, fetchSolicitors } from "../models/solicitors.model";

export type Solicitor = {
  name: string;
  location: string;
  address: string;
};

export const getSolicitors: express.RequestHandler<
  {},
  { solicitors: Solicitor[] },
  {}
> = async (req, res, next) => {
  try {
    const solicitors = await fetchSolicitors();
    res.status(200).send({ solicitors });
  } catch (err) {
    next(err);
  }
};

export const postSolicitors: express.RequestHandler<
  {},
  { solicitor: Solicitor },
  { name: string; location: string; address: string },
  {}
> = async (req, res, next) => {
  try {
    const { name, location, address } = req.body;
    const solicitor = await addSolicitor(name, location, address);
    res.status(201).send({ solicitor });
  } catch (err) {
    next(err);
  }
};
