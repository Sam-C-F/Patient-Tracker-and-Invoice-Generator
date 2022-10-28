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
  describe("GET api/patients/:patient_id", () => {
    it("200: responds with the patient, their dob, associated reference, and the solicitor", async () => {
      const { body } = await request(app).get("/api/patients/2").expect(200);
      expect(body.patient).to.eql({
        patient_id: 2,
        patient_name: "Mr Leo Caprio",
        dob: "12-05-1968",
        reference: "ABC12345",
        solicitor: "Kennedys",
      });
    });
    it("404: id number not found", async () => {
      const { body } = await request(app).get("/api/patients/100").expect(404);
      expect(body.msg).to.eql("not found");
    });
    it("400: id number invalid", async () => {
      const { body } = await request(app)
        .get("/api/patients/invalid")
        .expect(400);
      expect(body.msg).to.eql("bad request");
    });
  });
});

describe("/api/solicitors", () => {
  describe("GET", () => {
    it("200: responds with an array of solicitors, their address, and location", async () => {
      const { body } = await request(app).get("/api/solicitors").expect(200);
      assert.isArray(body.solicitors);
      expect(body.solicitors).to.have.length.greaterThan(0);
      body.solicitors.forEach((solicitor: {}) => {
        expect(solicitor).to.include.keys("name", "location", "address");
      });
    });
  });
  describe("POST", () => {
    it("201: responds with the posted solicitor", async () => {
      const testSolicitor = {
        name: "Test LLP",
        location: "Oxford",
        address: "Test Street, Test, Testshire, TE5 T39",
      };
      const { body } = await request(app)
        .post("/api/solicitors")
        .send(testSolicitor)
        .expect(201);
      expect(body.solicitor).to.eql({
        solicitor_id: 6,
        name: "Test LLP",
        location: "Oxford",
        address: "Test Street, Test, Testshire, TE5 T39",
      });
    });
    it("400: wrong data type entered", async () => {
      const testSolicitor = {
        name: "Test LLP",
        location: 18,
        address: "Test Street, Test, Testshire, TE5 T39",
      };
      const { body } = await request(app)
        .post("/api/solicitors")
        .send(testSolicitor)
        .expect(400);
      expect(body.msg).to.eql("bad request");
    });
    it("400: empty data field", async () => {
      const testSolicitor = {
        name: "Test LLP",
        location: "Oxford",
        address: "",
      };
      const { body } = await request(app)
        .post("/api/solicitors")
        .send(testSolicitor)
        .expect(400);
      expect(body.msg).to.eql("bad request");
    });
  });
});
