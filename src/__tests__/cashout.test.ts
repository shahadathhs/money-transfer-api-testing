import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app";
import CashOut from "../models/cashout.model";

beforeAll(async () => {
  // Setup your database connection or any required server setup
  await mongoose.connect("mongodb://localhost:27017/moneyTransferDB");
});

afterAll(async () => {
  // Cleanup
  await mongoose.disconnect();
});

describe("CashOut API Testing", () => {
  const cashOutPayLoad = {
    _id: new mongoose.Types.ObjectId(),
    amount: 2000,
    agentId: new mongoose.Types.ObjectId().toString(),
    requesterId: new mongoose.Types.ObjectId().toString(),
    status: "pending",
    requestedAt: new Date(),
    approvedAt: new Date(),
  };
  

  let cashOuts: { _id: any; }[];

  describe("GET /cashouts all cashouts", () => {
    it("should return all cashouts", async () => {
      const response = await supertest(app).get("/cashouts");
      expect(response.status).toBe(200);
      cashOuts = response.body;
      expect(response.body).toBeInstanceOf(Array);
    });

    it("should return 404 if no cashouts found", async () => {
      jest.spyOn(CashOut, "find").mockResolvedValueOnce([]);
      const response = await supertest(app).get("/cashouts");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "No cashout requests found"
      );
    });

    it("should return 500 if there is an error", async () => {
      jest
        .spyOn(CashOut, "find")
        .mockRejectedValueOnce(new Error("Database error"));
      const response = await supertest(app).get("/cashouts");
      expect(response.status).toBe(500);
    });
  });

  describe("GET /cashouts/:id single cashout", () => {
    it("should return a cashout by ID", async () => {
      const response = await supertest(app).get(
        `/cashouts/${cashOuts[0]._id}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id", cashOuts[0]._id.toString());
    });

    it("should return a 400 if cashout ID is invalid", async () => {
      const response = await supertest(app).get(`/cashouts/invalid`);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Cashout ID is not valid! Please enter a valid cashout id"
      );
    });

    it("should return a 404 if cashout is not found", async () => {
      jest
        .spyOn(CashOut, "findById")
        .mockResolvedValueOnce(null);
      const response = await supertest(app).get(
        `/cashouts/${cashOuts[0]._id}`
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "Cashout request not found"
      );
    });

    it("should return a 500 if there is an error", async () => {
      jest
        .spyOn(CashOut, "findById")
        .mockRejectedValueOnce(new Error("Database error"));
      const response = await supertest(app).get(
        `/cashouts/${cashOuts[0]._id}`
      );
      expect(response.status).toBe(500);
    });
  });

  describe("POST /cashouts create cashout", () => {
    it("should create a new cashout", async () => {
      const response = await supertest(app).post("/cashouts").send(cashOutPayLoad);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("status", cashOutPayLoad.status);
    });

    it("should return a 400 if request body is invalid", async () => {
      const response = await supertest(app).post("/cashouts").send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "All fields are required");
    });

    it("should return a 500 if there is an error", async () => {
      jest
        .spyOn(CashOut, "create")
        .mockRejectedValueOnce(new Error("Database error"));
      const response = await supertest(app).post("/cashouts").send(cashOutPayLoad);
      expect(response.status).toBe(500);
    })
  });

  describe("PUT /cashouts/:id update cashout", () => {
    it("should update a cashout", async () => {
      const response = await supertest(app).put(
        `/cashouts/${cashOuts[0]._id}`
      ).send({ status: "approved" });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "approved");
    });

    it("should return a 400 if cashout ID is invalid", async () => {
      const response = await supertest(app).put(`/cashouts/invalid`).send({
        status: "approved",
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Cashout ID is not valid! Please enter a valid cashout id"
      );
    });

    it("should return 401 if status is not provided", async () => {
      const response = await supertest(app).put(`/cashouts/${cashOuts[0]._id}`).send({})
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Status is required");
    });

    it("should return a 404 if cashout is not found", async () => {
      jest
        .spyOn(CashOut, "findByIdAndUpdate")
        .mockResolvedValueOnce(null);
      const response = await supertest(app).put(
        `/cashouts/${cashOuts[0]._id}`
      ).send({ status: "approved" });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "Cashout request not found"
      );
    });

    it("should return a 500 if there is an error", async () => {
      jest
        .spyOn(CashOut, "findByIdAndUpdate")
        .mockRejectedValueOnce(new Error("Database error"));
      const response = await supertest(app).put(
        `/cashouts/${cashOuts[0]._id}`
      ).send({ status: "approved" });
      expect(response.status).toBe(500);
    });
  });

  describe("DELETE /cashouts/:id delete cashout", () => {
    it("should delete a cashout", async () => {
      const response = await supertest(app).delete(
        `/cashouts/${cashOuts[cashOuts.length - 1]._id}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Cashout request deleted successfully");
    });

    it("should return a 400 if cashout ID is invalid", async () => {
      const response = await supertest(app).delete(`/cashouts/invalid`);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Cashout ID is not valid! Please enter a valid cashout id"
      );
    });

    it("should return a 404 if cashout is not found", async () => {
      jest
        .spyOn(CashOut, "findByIdAndDelete")
        .mockResolvedValueOnce(null);
      const response = await supertest(app).delete(
        `/cashouts/${cashOuts[cashOuts.length - 1]._id}`
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "Cashout request not found"
      );
    });

    it("should return a 500 if there is an error", async () => {
      jest
        .spyOn(CashOut, "findByIdAndDelete")
        .mockRejectedValueOnce(new Error("Database error"));
      const response = await supertest(app).delete(
        `/cashouts/${cashOuts[cashOuts.length - 1]._id}`
      );
      expect(response.status).toBe(500);
    });
  });
});
