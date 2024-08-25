import mongoose from "mongoose";
import supertest from "supertest";
import app from "./../app";
import SendMoney from "../models/sendmoney.model";

beforeAll(async () => {
  // Setup your database connection or any required server setup
  await mongoose.connect("mongodb://localhost:27017/moneyTransferDB");
});

afterAll(async () => {
  // Cleanup
  await mongoose.disconnect();
});

describe("Send Money API Testing", () => {
  const sendMoneyPayload = {
    _id: new mongoose.Types.ObjectId(),
    receiverId: new mongoose.Types.ObjectId().toString(),
    senderId: new mongoose.Types.ObjectId().toString(),
    amountSent: 1000,
    fee: 10,
    sentAt: new Date(),
  };

  let sendMoneys: { _id: any }[];

  describe("GET /sendmoneys all sendmoneys", () => {
    it("should return all sendmoneys", async () => {
      const response = await supertest(app).get("/sendmoneys");
      expect(response.status).toBe(200);
      sendMoneys = response.body;
      expect(response.body).toBeInstanceOf(Array);
    });

    it("should return 404 if no sendmoneys found", async () => {
      jest.spyOn(SendMoney, "find").mockResolvedValueOnce([]);
      const response = await supertest(app).get("/sendmoneys");
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "No sendmoneys found");
    });

    it("should return 500 if an error occurs", async () => {
      jest
        .spyOn(SendMoney, "find")
        .mockRejectedValueOnce(new Error("Database error"));
      const response = await supertest(app).get("/sendmoneys");
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Server error");
    });
  });

  describe("GET /sendmoneys/:id single sendmoney", () => {
    it("should return a single sendmoney", async () => {
      const response = await supertest(app).get(
        `/sendmoneys/${sendMoneys[0]._id}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id");
    });

    it("should return 400 if ID is invalid", async () => {
      const response = await supertest(app).get(`/sendmoneys/invalid-id`);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Invalid transaction ID");
    });

    it("should return 404 if sendmoney not found", async () => {
      const response = await supertest(app).get(
        `/sendmoneys/${new mongoose.Types.ObjectId()}`
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Transaction not found");
    });

    it("should return 500 if an error occurs", async () => {
      jest
        .spyOn(SendMoney, "findOne")
        .mockRejectedValueOnce(new Error("Database error"));
      const response = await supertest(app).get(
        `/sendmoneys/${sendMoneys[0]._id}`
      );
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Server error");
    });
  });

  describe("POST /sendmoneys create sendmoney", () => {
    it("should create a new sendmoney", async () => {
      const response = await supertest(app)
        .post("/sendmoneys")
        .send(sendMoneyPayload);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("_id");
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await supertest(app).post("/sendmoneys").send({});
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "All fields are required"
      );
    });

    it("should return 500 if an error occurs", async () => {
      jest
        .spyOn(SendMoney, "create")
        .mockRejectedValueOnce(new Error("Database error"));
      const response = await supertest(app)
        .post("/sendmoneys")
        .send(sendMoneyPayload);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Server error");
    });
  });

  describe("DELETE /sendmoneys/:id delete sendmoney", () => {
    it("should delete a sendmoney", async () => { 
      const response = await supertest(app).delete(
        `/sendmoneys/${sendMoneys[sendMoneys.length - 1]._id}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Transaction deleted successfully");
    });

    it("should return 400 if ID is invalid", async () => {
      const response = await supertest(app).delete(`/sendmoneys/invalid-id`);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Invalid transaction ID");
    });

    it("should return 404 if sendmoney not found", async () => {
      const response = await supertest(app).delete(
        `/sendmoneys/${new mongoose.Types.ObjectId()}`
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Transaction not found");
    });

    it("should return 500 if an error occurs", async () => {
      jest
        .spyOn(SendMoney, "deleteOne")
        .mockRejectedValueOnce(new Error("Database error"));
      const response = await supertest(app).delete(
        `/sendmoneys/${sendMoneys[sendMoneys.length - 1]._id}`
      );
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message", "Server error");
    });
  }); 
});
