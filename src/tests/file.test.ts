import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import fs from "fs";

let app: Express;

beforeAll(async () => {
    app = await initApp();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("File Tests", () => {
    test("upload file", async () => {
        const filePath = `${__dirname}/test_file.txt`;

        if (!fs.existsSync(filePath)) {
            throw new Error(`File ${filePath} does not exist.`);
        }

        try {
            const response = await request(app)
                .post("/file")
                .attach("file", filePath);
            
            console.log("Upload response:", response.body);  
            expect(response.statusCode).toEqual(200);

            let url = response.body.url;
            console.log("URL from response:", url);  

            url = url.replace(/^.*\/\/[^/]+/, ''); 
            const res = await request(app).get(url);
            console.log("File fetch response:", res.statusCode);  
            expect(res.statusCode).toEqual(200);  
        } catch (err) {
            console.error("Error during file upload:", err); 
            expect(1).toEqual(2);  
        }
    });
});
