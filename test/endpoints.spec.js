const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const supertest = require("supertest");
const helper = require("./test-helpers");
const { set } = require("../src/app");
const jwt = require("jsonwebtoken");
const config = require("../src/config");
// const { delete } = require("../src/map/map-router");

describe("MapForge Endpoints", function () {
    let db;

    before("make knex instance", () => {
        db = knex({
            client: "pg",
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set("db", db);
    });

    after("disconnect from db", () => db.destroy());

    before("cleanup", () => {
        return app.get("db").raw(`TRUNCATE maps,
users RESTART IDENTITY CASCADE;`);
    });

    before("clean insert", () => {
        return app.get("db").raw(`BEGIN;
INSERT INTO users (user_name, full_name, nickname, password)
VALUES (
		'nagleg',
		'Grey Nagle',
		null,
		'$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'
	),
	(
		'j.C01l',
		'Jennifer Collins',
		'J Col',
		'$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO'
	),
	(
		'naglegrey',
		'Grey Nagle',
		'Nagz',
		'$2a$12$yaRLSYgfCMr.e57VjWyjDuWypHh79jR0szDEonWInK4WFgjS3VI6K'
	);
COMMIT;
BEGIN;
INSERT INTO maps (map_name, map_string, width, user_id)
VALUES (
		'test A',
		'ttbbbbbbttbbbbbbbbwbwwwwwwwwwwbbbbbbbbbbbbbbttbbttttttttttttttttttttttttttttttttt',
		9,
		1
	),
	(
		'test B',
		'ttttttttttbbbtttttbbbbbtttbwwwwbbtttwbbwwbbbttbbbwwbbbtttbbwwwbbtttbbbwwbttttbbbb',
		9,
		2
	),
	(
		'test C',
		'ttttttttttttttttttttttttttttbttttttttbbbtbbbbtbbwwbbbbbbbbwbwwwwwbbbwbbwwbwwwwwbbbbbbbbbbb',
		10,
		1
	),
	(
		'test D',
		'tttttttttttttttttttttbtttwbbtbwwbbt',
		5,
		3
	),
	(
		'test E',
		'ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttbttttttttttttttttttttttttbbbtttttttttttttttttttttbbbwwbttttttttttttttbbttbbbbwwbbtttttttttttttbbbbbbbwwwbbtttttbbtbbbbbbbwwbbwwwbbbttbbbbbbbbbbbbbbwwwwwbbbbttbbbbbwwbwwwwwwwwbbbbbbtttbwwwwbwwwwbbbbbbbbbbbttttttbbbwwwbbbbbbbbbbtttttttttttbbbbbbbbttttttttttttttttttttbbbtttttttttttttttttttt',
		26,
		3
	)
;
COMMIT;`);
    });

    // New user tests
    describe("POST /users", () => {
        const newUser = [{}];

        it("should return success if all information supplied", () => {
            return supertest(app)
                .post("/api/users")
                .send({
                    password: "testPassw0rd!",
                    user_name: "testUser",
                    full_name: "Lord Test User III",
                    nickname: "TestMan",
                })
                .expect(201);
        });

        it("should return an issue if username already exists", () => {
            return supertest(app)
                .post("/api/users")
                .send({
                    password: "testPassw0rd!",
                    user_name: "naglegrey",
                    full_name: "Lord Test User III",
                    nickname: "TestMan",
                })
                .expect(400);
        });

        it("should return an error when supplied with insufficient info", () => {
            return supertest(app)
                .post("/api/users")
                .send({
                    user_name: "naglegrey",
                    full_name: "Lord Test User III",
                    nickname: "TestMan",
                })
                .expect(400);
        });
    });

    // validation tests
    describe("POST /auth", () => {
        it("should return success if all information supplied", () => {
            return supertest(app)
                .post("/api/auth/login")
                .send({
                    password: "Passw0rd!",
                    user_name: "naglegrey",
                })
                .expect(200);
        });

        it("should return an issue if info is incorrect", () => {
            return supertest(app)
                .post("/api/auth/login")
                .send({
                    password: "Passw0rd!",
                    user_name: "nagleblue",
                })
                .expect(400);
        });
    });

    // Map routes
    describe("POST /maps", () => {
        it("should return success if all information supplied to an 'ADD' test", () => {
            const token = jwt.sign({ user_id: 3 }, config.JWT_SECRET, {
                subject: "naglegrey",
                algorithm: "HS256",
            });
            return supertest(app)
                .post("/api/maps")
                .set({ Authorization: `Bearer ${token}` })
                .send({
                    map_name: "testMap",
                    map_string: "bbbbbtttttwwwwwbbbbbbbbbb",
                    width: 5,
                    user_id: 1,
                })
                .expect(201);
        }),
            it("should return success if all information supplied to an 'UPDATE' test", () => {
                const token = jwt.sign({ user_id: 3 }, config.JWT_SECRET, {
                    subject: "naglegrey",
                    algorithm: "HS256",
                });
                return supertest(app)
                    .post("/api/maps")
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        map_name: "test E",
                        map_string:
                            "ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttbttttttttttttttttttttttttbbbtttttttttttttttttttttbbbwwbttttttttttttttbbttbbbbwwbbtttttttttttttbbbbbbbwwwbbtttttbbtbbbbbbbwwbbwwwbbbttbbbbbbbbbbbbbbwwwwwbbbbttbbbbbwwbwwwwwwwwbbbbbbtttbwwwwbwwwwbbbbbbbbbbbttttttbbbwwwbbbbbbbbbbtttttttttttbbbbbbbbttttttttttttttttttttbbbtttttttttttttttttttt",
                        width: 13,
                        user_id: 3,
                    })
                    .expect(201);
            });
    });

    describe("GET /maps", () => {
        it("should return success if all information supplied", () => {
            let token = jwt.sign({ user_id: 3 }, config.JWT_SECRET, {
                subject: "naglegrey",
                algorithm: "HS256",
            });
            // console.log(token);
            return supertest(app)
                .get("/api/maps")
                .set({ Authorization: `Bearer ${token}` })
                .send({
                    map_name: "testMap",
                    map_string: "bbbbbtttttwwwwwbbbbbbbbbb",
                    width: 5,
                    user_id: 1,
                })
                .expect(200);
        });
    });

	describe("DELETE /maps", () => {
        it("should delete the selected map", () => {
            let token = jwt.sign({ user_id: 3 }, config.JWT_SECRET, {
                subject: "naglegrey",
                algorithm: "HS256",
            });
            // console.log(token);
            return supertest(app)
                .delete("/api/maps")
                .set({ Authorization: `Bearer ${token}` })
                .send({
                    map_name: "test D",
                })
                .expect(201);
        });
    });
});
