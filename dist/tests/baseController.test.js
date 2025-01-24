"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server")); // Adjust path if needed
const mongoose_1 = __importDefault(require("mongoose"));
const postModel_1 = __importDefault(require("../models/postModel")); // Assuming postModel is the model for your posts
const userModel_1 = __importDefault(require("../models/userModel"));
var app;
let testUser;
let postId = ""; // To store post ID for later tests
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, server_1.default)();
    yield postModel_1.default.deleteMany();
    yield userModel_1.default.deleteMany();
    // Register and login a test user
    testUser = {
        email: "test@user.com",
        password: "testpassword",
    };
    yield (0, supertest_1.default)(app).post("/auth/register").send(testUser);
    const res = yield (0, supertest_1.default)(app).post("/auth/login").send(testUser);
    testUser.token = res.body.accessToken;
    testUser._id = res.body._id;
    expect(testUser.token).toBeDefined();
}));
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
describe("BaseController Tests", () => {
    test("should get all posts filtered by senderId", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts?senderId=" + testUser._id);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach((post) => {
            expect(post.senderId).toBe(testUser._id); // Assert that senderId matches the test user ID
        });
        console.log("response.body", response.body);
    }));
    test("should create a post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/posts")
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
    }));
    test("Get post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + postId);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    }));
    test("should update post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).put("/posts/" + postId)
            .set("Authorization", "JWT " + testUser.token)
            .send({
            title: "Updated Test Post",
            content: "Updated Test Content",
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe("Updated Test Post");
        expect(response.body.content).toBe("Updated Test Content");
    }));
    test("should return 400 if post not found by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/invalidId");
        expect(response.statusCode).toBe(400);
    }));
    test("should delete post by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/posts/" + postId)
            .set("Authorization", "JWT " + testUser.token);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(postId);
    }));
    test("should return 404 when trying to get a deleted post", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/posts/" + postId);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({});
    }));
    test("should return 400 if post to update is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).put("/posts/invalidId")
            .set("Authorization", "JWT " + testUser.token)
            .send({
            title: "Updated Test Post",
            content: "Updated Test Content",
        });
        expect(response.statusCode).toBe(400);
    }));
    test("should return 400 if post to delete is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/posts/invalidId")
            .set("Authorization", "JWT " + testUser.token);
        expect(response.statusCode).toBe(400);
    }));
    describe("BaseController Tests - Additional Test Cases", () => {
        test("should get all posts with no filters", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get("/posts");
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        }));
        test("should return empty array for getAll with invalid senderId", () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidUserId = "5f50c31e9d2e7e5d935c71ff";
            const response = yield (0, supertest_1.default)(app).get("/posts?senderId=" + invalidUserId);
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(0);
        }));
        test("should return 400 when creating a post with missing title", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post("/posts")
                .set("Authorization", "JWT " + testUser.token)
                .send({
                content: "This is a post without a title",
                owner: testUser._id,
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBeDefined();
        }));
        test("should return 400 when deleting a post with invalid ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidPostId = "5f50c31e9d2e7e5d935c71ffyryuhy";
            const response = yield (0, supertest_1.default)(app).delete("/posts/" + invalidPostId)
                .set("Authorization", "JWT " + testUser.token);
            expect(response.statusCode).toBe(400);
        }));
        test("should return posts when querying by senderId", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get("/posts?senderId=" + testUser._id);
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            response.body.forEach((post) => {
                expect(post.senderId).toBe(testUser._id);
            });
        }));
        test("should return 404 if querying for non-existent field", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get("/posts/unknownField/xyz")
                .set("Authorization", "JWT " + testUser.token);
            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({});
        }));
        test("should return 200 when retrieving posts by query params (senderId and owner)", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get("/posts?senderId=" + testUser._id + "&owner=" + testUser._id);
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        }));
        test("should return 400 when no posts are found for a specific field value", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get("/posts/owner").query({ owner: "nonExistentOwnerId" });
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty("message");
        }));
        test("should return 400 when deleteItem is called with invalid ID format", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).delete("/posts/invalidIdFormat")
                .set("Authorization", "JWT " + testUser.token);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe("Invalid ID format");
        }));
        test("should return 400 when update is called with invalid data", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).put("/posts/" + postId)
                .set("Authorization", "JWT " + testUser.token)
                .send({
                title: "",
                content: "",
            });
            expect(response.statusCode).toBe(404);
        }));
        test("should return 400 when create is called with invalid data", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).post("/posts")
                .set("Authorization", "JWT " + testUser.token)
                .send({
                title: "",
                content: "",
                owner: testUser._id,
            });
            expect(response.statusCode).toBe(400);
        }));
    });
});
//# sourceMappingURL=baseController.test.js.map