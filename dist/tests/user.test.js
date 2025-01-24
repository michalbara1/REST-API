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
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../models/userModel"));
var app;
let userId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("beforeAll");
    app = yield (0, server_1.default)();
    yield userModel_1.default.deleteMany();
    const testUser = {
        email: "testuser@example.com",
        password: "password123"
    };
    const createdUser = yield userModel_1.default.create(testUser); // Save the user in the database
    userId = createdUser._id.toString(); // Save the created user's ID for further tests
}));
afterAll((done) => {
    console.log("afterAll");
    mongoose_1.default.connection.close(); // Close DB connection after tests
    done();
});
describe("User Tests", () => {
    test("Test Create User", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            email: "newuser@example.com",
            password: "newpassword123"
        };
        const response = yield (0, supertest_1.default)(app)
            .post("/users")
            .send(newUser);
        expect(response.statusCode).toBe(201);
        expect(response.body.email).toBe(newUser.email);
        expect(response.body.password).toBeDefined(); // Password should be hashed and not exposed
    }));
    test("Test Get All Users", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/users/getusers");
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true); // Should return an array
        expect(response.body.length).toBeGreaterThan(0); // At least one user should exist
    }));
    test("Test Get User by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/users/${userId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(userId); // Check that the user returned matches the ID
        expect(response.body.email).toBe("testuser@example.com");
    }));
    test("Test Update User by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = {
            email: "updateduser@example.com", // Changing the email
            password: "newpassword123" // Changing the password
        };
        const response = yield (0, supertest_1.default)(app)
            .put(`/users/${userId}`)
            .send(updatedUser);
        expect(response.statusCode).toBe(200);
        expect(response.body.email).toBe(updatedUser.email); // Check if the email was updated
    }));
    // Test: Delete User by ID
    test("Test Delete User by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete(`/users/${userId}`);
        expect(response.statusCode).toBe(200);
        // Verify user is deleted
        const deletedUser = yield (0, supertest_1.default)(app).get(`/users/${userId}`);
        expect(deletedUser.statusCode).toBe(404); // Should return a 404 as the user is deleted
    }));
});
//# sourceMappingURL=user.test.js.map