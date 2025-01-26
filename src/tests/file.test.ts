import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import e, { Express } from "express";

let app: Express;

beforeAll(async () => {
    console.log("Before all tests");
    app = await appInit();
});

afterAll((done) => {
    console.log("After all tests");
    mongoose.connection.close();
    done();
});

describe("File Tests", () => {
    test("upload file", async () => {
        const filePath = `${__dirname}/test_file.txt`;
        console.log("File path: ", filePath);

        try {
            const response = await request(app)
                .post("/file?file=test_file.txt").attach('file', filePath)
            console.log("Response: ", response.body);
            expect(response.statusCode).toEqual(200);
            let url = response.body.url;
            url = url.replace(/^.*\/\/[^/]+/, '')
            console.log("URL: ", url);
            const res = await request(app).get(url)
            expect(res.statusCode).toEqual(200);
            console.log("File content: ", res.text);
        } catch (err) {
            console.log(err);
            expect(1).toEqual(2);
        }
    })
})