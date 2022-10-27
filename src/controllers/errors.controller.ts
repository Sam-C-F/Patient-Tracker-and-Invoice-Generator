import express from "express";
import { NextFunction } from "express";

export const PSQLErrors: express.ErrorRequestHandler<{}, { msg: string }> = (
  err,
  req,
  res,
  next
) => {
  const errorCodes = ["22P02"];
  if (errorCodes.includes(err.code)) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

export const badRequestErrors: express.ErrorRequestHandler<
  {},
  { msg: string }
> = (err, req, res, next: NextFunction) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

export const internalServerError: express.ErrorRequestHandler<
  {},
  { msg: string }
> = (err, req, res, next) => {
  if (err) {
    console.log(err);
  }
  res.status(500).send({ msg: "Internal Server Error" });
};
