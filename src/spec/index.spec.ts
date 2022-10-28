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
          dob: "16/08/1990",
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
          dob: "16/08/1990",
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
        dob: "1900/01/01",
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
        dob: "01/01/1900",
        solicitor: "Keoghs",
        location: "Manchester",
      });
    });
    it("400: wrong data type entered", async () => {
      const testPatient = {
        patient_name: "Mr Alpha Omega",
        dob: "1900/01/01",
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
        dob: "1900/01/01",
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
        dob: "12/05/1968",
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
  describe("GET api/solicitors/:solicitor_id", () => {
    it("200: responds with the solicitor", async () => {
      const { body } = await request(app).get("/api/solicitors/2").expect(200);
      expect(body.solicitor).to.eql({
        solicitor_id: 2,
        name: "Keoghs",
        location: "Bolton",
        address: "Keoghs LLP, 2 The Parklands, Lostock, Manchester BL6 4SE",
      });
    });
    it("404: id number not found", async () => {
      const { body } = await request(app)
        .get("/api/solicitors/100")
        .expect(404);
      expect(body.msg).to.eql("not found");
    });
    it("400: id number invalid", async () => {
      const { body } = await request(app)
        .get("/api/solicitors/invalid")
        .expect(400);
      expect(body.msg).to.eql("bad request");
    });
  });
});

describe("/api/invoices", () => {
  describe("GET", () => {
    it("200: responds with an array of all invoices", async () => {
      const { body } = await request(app).get("/api/invoices").expect(200);
      assert.isArray(body.invoices);
      expect(body.invoices).to.have.length.greaterThan(0);
      body.invoices.forEach((invoice: {}) => {
        expect(invoice).to.include.all.keys(
          "reference",
          "patient_name",
          "invoice_number",
          "date",
          "description",
          "hours_worked",
          "hourly_rate",
          "solicitor_name",
          "address"
        );
      });
    });
  });
  describe("POST", () => {
    it("201: responds with the posted invoice", async () => {
      const testInvoice = {
        description: "To the Completion of a Report",
        hours_worked: 8,
        hourly_rate: 250,
        patient_id: 1,
      };
      const { body } = await request(app)
        .post("/api/invoices")
        .send(testInvoice)
        .expect(201);
      expect(body.invoice).to.eql({
        invoice_number: 7,
        description: "To the Completion of a Report",
        hours_worked: 8,
        hourly_rate: 250,
        date: new Date().toLocaleDateString("en-GB"),
        reference: "1111111",
        patient_name: "Mr John Doe",
        solicitor_name: "Clyde & Co",
        address:
          "Clyde & Co, Royal Exchange Building, St Ann's Square, Manchester, M2 7EF",
      });
    });
    it("400: wrong data type entered", async () => {
      const testInvoice = {
        description: "To the Completion of a Report",
        hours_worked: 8,
        hourly_rate: 250,
        patient_id: "one",
      };
      const { body } = await request(app)
        .post("/api/invoices")
        .send(testInvoice)
        .expect(400);
      expect(body.msg).to.eql("bad request");
    });
    it("400: empty data field", async () => {
      const testInvoice = {
        description: "",
        hours_worked: 8,
        hourly_rate: 250,
        patient_id: 1,
      };
      const { body } = await request(app)
        .post("/api/invoices")
        .send(testInvoice)
        .expect(400);
      expect(body.msg).to.eql("bad request");
    });
  });
  describe("GET api/invoices/:invoice_id", () => {
    it("returns only the invoice relating to the associated invoice_number", async () => {
      const { body } = await request(app).get("/api/invoices/2").expect(200);
      expect(body.invoice).to.include.all.keys(
        "reference",
        "patient_name",
        "invoice_number",
        "date",
        "description",
        "hours_worked",
        "hourly_rate",
        "solicitor_name",
        "address"
      );
    });
    it("404: id number not found", async () => {
      const { body } = await request(app).get("/api/invoices/30").expect(404);
      expect(body.msg).to.eql("not found");
    });
    it("400: id number invalid", async () => {
      const { body } = await request(app)
        .get("/api/invoices/invalid")
        .expect(400);
      expect(body.msg).to.eql("bad request");
    });
  });
  describe("GET api/invoices/patient/:patient_id", () => {
    it("returns only the invoices relating to the associated patient_id", async () => {
      const { body } = await request(app)
        .get("/api/invoices/patient/7")
        .expect(200);
      expect(body.invoices).to.have.length(3);
      body.invoices.forEach((invoice: {}) => {
        expect(invoice).to.include.all.keys(
          "reference",
          "patient_name",
          "invoice_number",
          "date",
          "description",
          "hours_worked",
          "hourly_rate",
          "solicitor_name",
          "address"
        );
      });
    });
    it("404: id number not found", async () => {
      const { body } = await request(app)
        .get("/api/invoices/patient/30")
        .expect(404);
      expect(body.msg).to.eql("not found");
    });
    it("400: id number invalid", async () => {
      const { body } = await request(app)
        .get("/api/invoices/patient/invalid")
        .expect(400);
      expect(body.msg).to.eql("bad request");
    });
  });
});
