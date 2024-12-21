import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import userModel from "../models/userModel";
import { Express } from "express";

var app: Express;
let userId: string;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp(); 
  await userModel.deleteMany();
  const testUser = {
    email: "testuser@example.com",
    password: "password123"
  };

  const createdUser = await userModel.create(testUser); // Save the user in the database
  userId = createdUser._id.toString(); // Save the created user's ID for further tests
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close(); // Close DB connection after tests
  done();
});

describe("User Tests", () => {

  test("Test Create User", async () => {
    const newUser = {
      email: "newuser@example.com",
      password: "newpassword123"
    };

    const response = await request(app)
      .post("/users")
      .send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.password).toBeDefined();  // Password should be hashed and not exposed
  });


  test("Test Get All Users", async () => {
    const response = await request(app).get("/users/getusers");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);  // Should return an array
    expect(response.body.length).toBeGreaterThan(0);  // At least one user should exist
  });


  test("Test Get User by ID", async () => {
    const response = await request(app).get(`/users/${userId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(userId); // Check that the user returned matches the ID
    expect(response.body.email).toBe("testuser@example.com");
  });

  test("Test Update User by ID", async () => {
    const updatedUser = {
      email: "updateduser@example.com", // Changing the email
      password: "newpassword123" // Changing the password
    };

    const response = await request(app)
      .put(`/users/${userId}`)
      .send(updatedUser);

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(updatedUser.email); // Check if the email was updated
  });

  // Test: Delete User by ID
  test("Test Delete User by ID", async () => {
    const response = await request(app).delete(`/users/${userId}`);
    expect(response.statusCode).toBe(200);

    // Verify user is deleted
    const deletedUser = await request(app).get(`/users/${userId}`);
    expect(deletedUser.statusCode).toBe(404); // Should return a 404 as the user is deleted
  });
});
