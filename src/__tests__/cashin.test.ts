import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app";
import CashIn from "../models/cashin.model";

beforeAll(async () => {
  // Setup your database connection or any required server setup
  await mongoose.connect("mongodb://localhost:27017/moneyTransferDB");
});

afterAll(async () => {
  // Cleanup
  await mongoose.disconnect();
});

describe("CashIn API Testing", () => {
  const cashInPayLoad = {
    _id: new mongoose.Types.ObjectId(),
    amount: 1000,
    agentId: new mongoose.Types.ObjectId().toString(),
    requesterId: new mongoose.Types.ObjectId().toString(),
    status: "pending",
    requestedAt: new Date(),
    approvedAt: new Date(),
  };

  let cashIns: { _id: any; }[];

  describe("GET /cashins all cashins", () => {
    it("should return all cashins", async () => {
      const response = await supertest(app).get("/cashins");
      cashIns = response.body;
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it("should return an empty array if there are no cashins", async () => {
      // Mock the CashIn model to return an empty array
      jest.spyOn(CashIn, "find").mockResolvedValue([]);
      const response = await supertest(app).get("/cashins");
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([]);
    });

    it("should return a 500 if there is an error", async () => {
      jest.spyOn(CashIn, "find").mockRejectedValue(new Error("Database error"));
      const response = await supertest(app).get("/cashins");  
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Server error while fetching cashins");
    });
  });

  describe("GET /cashins/:id single cashin", () => {
    it("should return a cashin by id", async () => {
      const response = await supertest(app).get(`/cashins/${cashIns[0]._id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(cashIns[0]);
    });
    // if id is not provided then it will hit get all cashin api

    it("should return a 400 if cashin ID is invalid", async () => {
      const response = await supertest(app).get("/cashins/invalid-id");
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Cashin ID is not valid! Please enter a valid cashin id");
    });

    it("should return a 500 if there is an error", async () => {
      jest.spyOn(CashIn, "findById").mockRejectedValue(new Error("Database error"));
      const response = await supertest(app).get(`/cashins/${cashIns[0]._id}`);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Server error while fetching cashin");
    });
  });

  describe("POST /cashins create cashin", () => {
    it("should create a new cashin", async () => {
      const response = await supertest(app).post("/cashins").send(cashInPayLoad);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("_id");
    });

    it("should return a 400 if cashin data is not provided", async () => {
      const response = await supertest(app).post("/cashins").send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Please provide all required fields");
    });

    // it("should return a 500 if there is an error", async () => {
    //   // Mock the CashIn model to throw an error
    //   jest.spyOn(CashIn, "create").mockRejectedValue(new Error("Database error"));
    //   const response = await supertest(app).post("/cashins").send(cashInPayLoad);
    //   console.log(response.body); 
    //   expect(response.status).toBe(500);
    // });
  });

  describe("PUT /cashins/:id update cashin", () => {
    it("should update a cashin", async () => {
      const response = await supertest(app).put(`/cashins/${cashIns[0]._id}`).send({ status: "approved" });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "approved");
    });

    it("should return a 400 if cashin ID is invalid", async () => {
      const response = await supertest(app).put(`/cashins/invalid-id`).send({ status: "approved" });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Cashin ID is not valid! Please enter a valid cashin id");
    });

    it("should return a 404 if cashin is not found", async () => {
      jest.spyOn(CashIn, "findByIdAndUpdate").mockResolvedValue(null);
      const response = await supertest(app).put(`/cashins/${cashIns[0]._id}`).send({ status: "approved" });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Cashin request not found");
    });

    it("should return a 500 if there is an error", async () => {
      jest.spyOn(CashIn, "findByIdAndUpdate").mockRejectedValue(new Error("Database error"));
      const response = await supertest(app).put(`/cashins/${cashIns[0]._id}`).send({ status: "approved" });
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Server error while updating cashin");
    });
  });

  describe("DELETE /cashins/:id delete cashin", () => {
    it("should delete a cashin", async () => {
      const response = await supertest(app).delete(`/cashins/${cashIns[0]._id}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Cashin request deleted successfully");
    });

    it('should return a 404 if cashin ID is not found', async () => {
      const response = await supertest(app).delete(`/cashins/${cashIns[0]._id}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Cashin request not found");
    });

    it("should return a 400 if cashin ID is invalid", async () => {
      const response = await supertest(app).delete(`/cashins/invalid-id`);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Cashin ID is not valid! Please enter a valid cashin id");
    });

    it("should return a 500 if there is an error", async () => {
      jest.spyOn(CashIn, "findByIdAndDelete").mockRejectedValue(new Error("Database error"));
      const response = await supertest(app).delete(`/cashins/${cashIns[0]._id}`);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Server error");
    });
  });
});
