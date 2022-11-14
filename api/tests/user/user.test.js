const supertest = require("supertest");
const { api } = require("../setup");


const userData = {
	name: "cristiano",
	email: "cristiano.sar@gmail.com",
	password: "admin123",
	role: 1,
};

describe("User operations", () => {
	test("it should register a new user successfully", async () => {
		await supertest(api)
			.post("/user/register").send(userData)
			.expect(201)
			.then((response) => {
				const { body } = response;
				expect(typeof body === "object").toBeTruthy();
				expect(body.name).toBe(userData.name);
				expect(body.email).toBe(userData.email);
				expect(body.role).toBe(userData.role);
				expect(body).not.toHaveProperty("password");
			})
		})


	test("it should get a 412 (Pre-condition failed) when registering a user with invalid data", async () => {
		const invalidData = {...userData};
		delete invalidData.email;

		await supertest(api)
			.post("/user/register").send(invalidData)
			.expect(412)
			.then((response) => {
				const { body } = response;
				expect(typeof body === "object").toBeTruthy();
			})
		})

	test("it should get a 409 (conflit) when registering the same user email", async () => {
		await supertest(api)
			.post("/user/register").send(userData)
			.expect(409)
			.then((response) => {
				const { body } = response;
				expect(typeof body === "object").toBeTruthy();
			})
		})

	test("it should log-in the registered user successfully", async () => {
		await supertest(api)
			.post("/user/login").send(userData)
			.expect(200)
			.then((response) => {
				const { body } = response;
				expect(typeof body === "object").toBeTruthy();
				expect(body.name).toBe(userData.name);
				expect(body.email).toBe(userData.email);
				expect(body.role).toBe(userData.role);
				expect(body).toHaveProperty("token");
			})
		})

	test("it should get a 404 for a not found user", async () => {
		userData.email = 'test@mail.com';
		await supertest(api)
			.post("/user/login").send(userData)
			.expect(404)
			.then((response) => {
				const { body } = response;
				expect(typeof body === "object").toBeTruthy();
			})
		})
});

