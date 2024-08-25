import mongoose from "mongoose";
import supertest from "supertest";
import app from "./../app";
import User from "../models/user.model";

beforeAll(async () => {
  // Setup your database connection or any required server setup
  await mongoose.connect("mongodb://localhost:27017/moneyTransferDB");
});

afterAll(async () => {
  // Cleanup
  await mongoose.disconnect();
});

describe("Users API Testing", () => {
  // to do post and update tests
  const userPayload = {
    _id: new mongoose.Types.ObjectId(),
    name: "Test User",
    pin: "1234",
    phone: "1234567890",
    email: "Jpj9K@example.com",
    role: "user",
    statusOfUser: "pending",
    balance: 0,
  }

  // to store user data to use later in single user get test
  let users: { _id: any; }[];

  describe("GET /users all users", () => {
    it("should return all users", async () => {
      const response = await supertest(app).get("/users");
      users = response.body;
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    it("should return a 404 if no users are found", async () => {
      // Mock the User model to return an empty array
      jest.spyOn(User, "find").mockResolvedValue([]);
      const response = await supertest(app).get("/users");
      expect(response.status).toBe(404);
    });

    it("should return a 500 if there is an error", async () => {
      // Mock the User model to throw an error
      jest.spyOn(User, "find").mockRejectedValue(new Error("Database error"));
      const response = await supertest(app).get("/users");
      expect(response.status).toBe(500);
    });
  });

  describe("Get /users/:id single user", () => {
    it("should return a user by ID", async () => {
      // use _id from users array to get single user
      const response = await supertest(app).get(`/users/${users[0]._id}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name");
    });

    it("should return a 400 if user ID is invalid", async () => {
      // use an invalid _id to get single user
      const response = await supertest(app).get(`/users/invalid`);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "User ID is not valid! Please enter a valid user id");
    })

    it("should return a 404 if user is not found", async () => {
      // use an invalid _id to get single user
      const response = await supertest(app).get(`/users/${new mongoose.Types.ObjectId()}`);
      // console.log(response.body);
      expect(response.status).toBe(404);
    });
  });

  describe("PUT /users/:id update user", () => {
    it("should update a user", async () => {
      const response = await supertest(app).put(`/users/${users[0]._id}`).send({ name: "Updated User" });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name", "Updated User");
    });

    it("should return a 402 if userId is not provided", async () => {
      // Simulate a PUT request to `/users/` without providing an ID
      const response = await supertest(app).put(`/users/`).send({ name: "Updated User" });
      expect(response.status).toBe(404);
    });

    it("should return a 400 if user ID is invalid", async () => {
        const response = await supertest(app).put(`/users/invalid`).send({ name: "Updated User" });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "User ID is not valid! Please enter a valid user id");
    });

    it("should return a 401 if update data is not provided", async () => {
        const response = await supertest(app).put(`/users/${users[0]._id}`).send({});
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Update data is required");
    });

    it("should return a 404 if user is not found", async () => {
        const response = await supertest(app).put(`/users/${new mongoose.Types.ObjectId()}`).send({ name: "Updated User" });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "User not found or update failed");
    });
    
    it("should return a 500 if there is an error", async () => {
        jest.spyOn(User, "findByIdAndUpdate").mockRejectedValue(new Error("Database error"));
        const response = await supertest(app).put(`/users/${users[0]._id}`).send({ name: "Updated User" });
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("message", "Server error while updating the user");
    });
  });
});