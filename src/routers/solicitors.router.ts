import express from "express";
import {
  getSolicitorById,
  getSolicitors,
  postSolicitors,
} from "../controllers/solicitors.controller";

const solicitorsRouter = express.Router();

solicitorsRouter.get("/", getSolicitors);

solicitorsRouter.post("/", postSolicitors);

solicitorsRouter.get("/:solicitor_id", getSolicitorById);

export default solicitorsRouter;
