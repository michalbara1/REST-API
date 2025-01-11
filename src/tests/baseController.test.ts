import request from "supertest";
import initApp from "../server";  // Adjust path if needed
import mongoose from "mongoose";
import { Express } from "express";
import postModel from "../models/postModel";  // Assuming postModel is the model for your posts
import userModel, { IUser } from "../models/userModel";

var app: Express;
let testUser: IUser & { token?: string };
let postId = "";  // To store post ID for later tests

beforeAll(async () => {
  app = await initApp();
  await postModel.deleteMany();
  await userModel.deleteMany();

  // Register and login a test user
  testUser = {
    email: "test@user.com",
    password: "testpassword",
  };
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.token = res.body.accessToken;
  testUser._id = res.body._id;

  expect(testUser.token).toBeDefined();
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("BaseController Tests", () => {

  test("should get all posts filtered by senderId", async () => {
    const response = await request(app).get("/posts?senderId=" + testUser._id);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((post: { senderId: string }) => {
        expect(post.senderId).toBe(testUser._id); // Assert that senderId matches the test user ID
      });
    console.log("response.body", response.body);
  });

  test("should create a post", async () => {
    const response = await request(app).post("/posts")
      .set("Authorization", "JWT " + testUser.token)
      .send({
        title: "New Test Post",
        content: "This is a new test post",
        owner: testUser._id,
      });

    expect(response.statusCode).toBe(201); 
    expect(response.body.title).toBe("New Test Post"); 
    expect(response.body.content).toBe("This is a new test post");  
    postId = response.body._id;  
  });


  test("Get post by id", async () => {
    const response = await request(app).get("/posts/" + postId);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(postId);
  });

  test("should update post by id", async () => {
    const response = await request(app).put("/posts/" + postId)
      .set("Authorization", "JWT " + testUser.token)
      .send({
        title: "Updated Test Post",
        content: "Updated Test Content",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Updated Test Post");
    expect(response.body.content).toBe("Updated Test Content");
  });

  test("should return 400 if post not found by id", async () => {
    const response = await request(app).get("/posts/invalidId");
    expect(response.statusCode).toBe(400);
  });

  test("should delete post by id", async () => {
    const response = await request(app).delete("/posts/" + postId)
      .set("Authorization", "JWT " + testUser.token);
    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(postId);
  });

  test("should return 404 when trying to get a deleted post", async () => {
    const response = await request(app).get("/posts/" + postId);
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({});
  });


  test("should return 400 if post to update is not found", async () => {
    const response = await request(app).put("/posts/invalidId")
      .set("Authorization", "JWT " + testUser.token)
      .send({
        title: "Updated Test Post",
        content: "Updated Test Content",
      });
    expect(response.statusCode).toBe(400);
  });

    test("should return 400 if post to delete is not found", async () => {
        const response = await request(app).delete("/posts/invalidId")
        .set("Authorization", "JWT " + testUser.token);
        expect(response.statusCode).toBe(400);
    });
  
    describe("BaseController Tests - Additional Test Cases", () => {

      test("should get all posts with no filters", async () => {
        const response = await request(app).get("/posts");
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true); 
      });
    
      test("should return empty array for getAll with invalid senderId", async () => {
        const invalidUserId = "5f50c31e9d2e7e5d935c71ff";
        const response = await request(app).get("/posts?senderId=" + invalidUserId);
        expect(response.statusCode).toBe(200); 
        expect(response.body.length).toBe(0);  
      });
    
      test("should return 400 when creating a post with missing title", async () => {
        const response = await request(app).post("/posts")
          .set("Authorization", "JWT " + testUser.token)
          .send({
            content: "This is a post without a title", 
            owner: testUser._id,
          });
        expect(response.statusCode).toBe(400);  
        expect(response.body.message).toBeDefined(); 
      });
    
      test("should return 400 when deleting a post with invalid ID", async () => {
        const invalidPostId = "5f50c31e9d2e7e5d935c71ffyryuhy"; 
        const response = await request(app).delete("/posts/" + invalidPostId)
          .set("Authorization", "JWT " + testUser.token);
        expect(response.statusCode).toBe(400); 
      });
    
      test("should return posts when querying by senderId", async () => {
        const response = await request(app).get("/posts?senderId=" + testUser._id);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);  
        response.body.forEach((post: { senderId: string }) => {
          expect(post.senderId).toBe(testUser._id);  
        });
      });
    
    
      test("should return 404 if querying for non-existent field", async () => {
        const response = await request(app).get("/posts/unknownField/xyz")
          .set("Authorization", "JWT " + testUser.token);
        expect(response.statusCode).toBe(404);  
        expect(response.body).toEqual({});  
      });
    
    
      test("should return 200 when retrieving posts by query params (senderId and owner)", async () => {
        const response = await request(app).get("/posts?senderId=" + testUser._id + "&owner=" + testUser._id);
        expect(response.statusCode).toBe(200);  
        expect(Array.isArray(response.body)).toBe(true); 
      });

      test("should return 400 when no posts are found for a specific field value", async () => {
        const response = await request(app).get("/posts/owner").query({ owner: "nonExistentOwnerId" });
        expect(response.statusCode).toBe(400);  
        expect(response.body).toHaveProperty("message");
      });

      test("should return 400 when deleteItem is called with invalid ID format", async () => {
        const response = await request(app).delete("/posts/invalidIdFormat")
          .set("Authorization", "JWT " + testUser.token);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Invalid ID format");
      });

      test("should return 400 when update is called with invalid data", async () => {
        const response = await request(app).put("/posts/" + postId)
          .set("Authorization", "JWT " + testUser.token)
          .send({
            title: "",
            content: "",
          });
        expect(response.statusCode).toBe(404);
      });

      test("should return 400 when create is called with invalid data", async () => {
        const response = await request(app).post("/posts")
          .set("Authorization", "JWT " + testUser.token)
          .send({
            title: "",
            content: "",
            owner: testUser._id,
          });
        expect(response.statusCode).toBe(400);
      });
 
    });
});

