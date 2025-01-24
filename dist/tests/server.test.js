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
const server_1 = __importDefault(require("../server")); // Make sure initApp connects to the DB
const mongoose_1 = __importDefault(require("mongoose"));
var app;
describe('Server initialization', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';
        app = yield (0, server_1.default)();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
    test('Non-existent routes', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/nonexistent');
        expect(response.status).toBe(404);
    }));
    test('MONGO_URI not defined', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.MONGO_URI = '';
        try {
            yield (0, server_1.default)();
        }
        catch (error) {
            console.log('error', error);
            expect(error).toBe('MONGO_URI is not defined in .env file');
        }
    }));
});
//# sourceMappingURL=server.test.js.map