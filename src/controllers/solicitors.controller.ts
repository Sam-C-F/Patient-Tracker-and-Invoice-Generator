import express from "express";
import { fetchSolicitors } from "../models/solicitors.model";

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
