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

    it("should return a 404 if user is not found", async () => {
      // use an invalid _id to get single user
      const response = await supertest(app).get(`/users/${new mongoose.Types.ObjectId()}`);
      console.log(response.body);
      expect(response.status).toBe(404);
    });
  })
});
/*
Get all users: Verify that the endpoint returns a 
status code of 200 and an array of users.

Get a user by ID: Verify that the endpoint returns a 
status code of 200 and the expected user data when a valid user ID is provided.

Return 404 for non-existent user ID: Verify that the endpoint returns a 
status code of 404 and an appropriate error message when a non-existent user ID is provided.

Create a new user: Verify that the endpoint successfully creates a new user, 
returns a status code of 201, and the response contains the expected user data.

Update an existing user: Verify that the endpoint updates an existing user's details, 
returns a status code of 200, and the response contains the updated user data.

Delete a user: Verify that the endpoint successfully deletes a user, returns a 
status code of 200, and provides a confirmation message in the response.

Return 404 for deleting a non-existent user: Verify that the endpoint returns a 
status code of 404 and an appropriate error message when attempting to delete a user that does not exist.
*/
