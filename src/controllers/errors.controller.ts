import express from "express";

export const internalServerError: express.ErrorRequestHandler<
  {},
  { msg: string }
> = (err, req, res, next) => {
  if (err) {
    console.log(err);
  }
  res.status(500).send({ msg: "Internal Server Error" });
};
