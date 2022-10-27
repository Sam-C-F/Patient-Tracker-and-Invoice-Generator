process.env.NODE_ENV = "test";
import { expect, assert } from "chai";
import request from "supertest";
import app from "../app";
import * as testData from "../db/data/test-data/index";
import seed from "../db/seeds/seed";
import db from "../db/index";

beforeEach(() => seed(testData));
after(() => db.end());

describe("/api/patients", () => {
  describe("GET", () => {
    it("200: responds with an array of patients, their dob, associated reference, and the solicitor", async () => {
      const { body } = await request(app).get("/api/patients").expect(200);
      assert.isArray(body.patients);
      expect(body.patients).to.have.length.greaterThan(0);
      body.patients.forEach((patient: {}) => {
        expect(patient).to.include.all.keys(
          "reference",
          "patient_name",
          "dob",
          "solicitor"
        );
      });
    });
    it("200: returns search if patient exists", async () => {
      const { body } = await request(app)
        .get("/api/patients?search=Rooney")
        .expect(200);
      expect(body.patients).to.eql([
        {
          patient_name: "Mr Wayne Rooney",
          dob: "16-08-1990",
          patient_id: 10,
          reference: "99887766",
          solicitor: "Clyde & Co",
        },
      ]);
    });
    it("200: returns search if part of patient patient_name exists", async () => {
      const { body } = await request(app)
        .get("/api/patients?search=ney")
        .expect(200);
      expect(body.patients).to.eql([
        {
          patient_name: "Mr Wayne Rooney",
          dob: "16-08-1990",
          patient_id: 10,
          reference: "99887766",
          solicitor: "Clyde & Co",
        },
      ]);
    });
    it("404: returns an error if the patient does not exist", async () => {
      const { body } = await request(app)
        .get("/api/patients?search=xyz")
        .expect(404);
      expect(body.msg).to.eql("Patient not found.");
    });
  });
  describe("POST", () => {
    it("201: responds with the posted patient", async () => {
      const testPatient = {
        patient_name: "Mr Alpha Omega",
        dob: "1900-01-01",
        reference: "88888888",
        solicitor_id: 1,
      };
      const { body } = await request(app)
        .post("/api/patients")
        .send(testPatient)
        .expect(201);
      expect(body.patient).to.eql({
        patient_id: 11,
        reference: "88888888",
        patient_name: "Mr Alpha Omega",
        dob: "01-01-1900",
        solicitor: "Keoghs",
        location: "Manchester",
      });
    });
    it("400: wrong data type entered", async () => {
      const testPatient = {
        patient_name: "Mr Alpha Omega",
        dob: "1900-01-01",
        reference: "88888888",
        solicitor_id: "seven",
      };
      const { body } = await request(app)
        .post("/api/patients")
        .send(testPatient)
        .expect(400);
      expect(body.msg).to.eql("bad request");
    });
    it("400: empty data field", async () => {
      const testPatient = {
        patient_name: "Mr Alpha Omega",
        dob: "1900-01-01",
        reference: "",
        solicitor_id: "seven",
      };
      const { body } = await request(app)
        .post("/api/patients")
        .send(testPatient)
        .expect(400);
      expect(body.msg).to.eql("bad request");
    });
  });
});
