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
  });
});
