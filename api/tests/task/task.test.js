const supertest = require("supertest");
const { api } = require("../setup");

const userData = {
	name: "cristiano",
	email: "thefireworksblog@gmail.com",
	password: "admin123",
	role: 1,
};

const techUserData = {
	name: "maria",
	email: "maria@mail.com",
	password: "admin123",
	role: 2,
}

const techUserData2 = {
	name: "marcio",
	email: "marcio@mail.com",
	password: "admin123",
	role: 2,
}

const taskData = {
	title: "Test task",
	summary: "Registration page",
};

let taskId;
let userToken;
let techUserToken;

const createAndLoginUser = async (inputData) => {
	const userResp = await supertest(api)
		.post("/user/register")
		.send(inputData);

	const registeredUser = userResp.body;

	const loggedInUserResp = await supertest(api)
		.post("/user/login")
		.send({ email: inputData.email, password: inputData.password });

	return {
		id: loggedInUserResp.body.id,
		token: loggedInUserResp.body.token,
	};
};

describe("Task operations", () => {
	test("it should create a new task successfully", async () => {
		const { id: managerId, token: managerToken } = await createAndLoginUser(userData);

		userToken = managerToken;
		taskData.performerId = managerId;

		await supertest(api)
			.post("/task")
			.send(taskData)
			.set("Authorization", `Bearer ${userToken}`)
			.expect(201)
			.then((response) => {
				const { body } = response;
				taskId = body.id;
				expect(typeof body === "object").toBeTruthy();
				expect(body).toHaveProperty("id");
				expect(body.title).toBe(taskData.title);
				expect(body.performed_at).toBe(undefined);
				expect(body.summary).not.toBe(taskData.summary);
			})
		})

	test("it should return the created task by id for a manager", async () => {
		await supertest(api)
			.get(`/task/${taskId}`)
			.set("Authorization", `Bearer ${userToken}`)
			.expect(200)
			.then((response) => {
				const { body } = response;
				expect(typeof body === "object").toBeTruthy();
				expect(body).toHaveProperty("id");
				expect(body.id).toBe(taskId);
				expect(body).toHaveProperty("summary");
				expect(body).toHaveProperty("created");
				expect(body).toHaveProperty("updated");
				expect(body).toHaveProperty("creator_id");
				expect(body).toHaveProperty("performer_id");
			})
		})

	test("it should return a 404 for a non existing task", async () => {
		await supertest(api)
			.get("/task/a7c45474-d0e6-45ac-b3a9-d6ec69de844b")
			.set("Authorization", `Bearer ${userToken}`)
			.expect(404)
			.then((response) => {
				const { body } = response;
				expect(typeof body === "object").toBeTruthy();
			})
		})

	test("it should get a 404 if a tech try to obtain a task of which he is not the performer", async () => {
		const techUser2 = await createAndLoginUser(techUserData2)

		await supertest(api)
			.get(`/task/${taskId}`)
			.set("Authorization", `Bearer ${techUser2.token}`)
			.expect(404)
			.then((response) => {
				const { body } = response;
				expect(typeof body === "object").toBeTruthy();
			})
		})

	test("it should return all tasks for a manager", async () => {
		await supertest(api)
			.get("/task")
			.set("Authorization", `Bearer ${userToken}`)
			.expect(200)
			.then((response) => {
				const { body } = response;
				const [firstTask] = body;
				expect(Array.isArray(body)).toBeTruthy();
				expect(firstTask).toHaveProperty("id");
				expect(firstTask).toHaveProperty("title");
				expect(firstTask).toHaveProperty("summary");
				expect(firstTask).toHaveProperty("created");
				expect(firstTask).toHaveProperty("updated");
				expect(firstTask).toHaveProperty("creator_id");
				expect(firstTask).toHaveProperty("performer_id");
			})
		})

	test("it should get a 412 (Precondition failed) during validation errors", async () => {
		const invalidTask = {...taskData};
		delete invalidTask.summary;

		await supertest(api)
			.post("/task")
			.send(invalidTask)
			.set("Authorization", `Bearer ${userToken}`)
			.expect(412)
			.then((response) => {
				const { body } = response;
				expect(typeof body === "object").toBeTruthy();
				expect(body).toHaveProperty("detail");
			})
		})

	test("it should get a 401 (Unauthorized) when not passing the Authorization header", async () => {
		await supertest(api)
			.post("/task")
			.send(taskData)
			.expect(401)
			.then((response) => {
				const { body } = response;
				expect(typeof body === "object").toBeTruthy();
			})
		})

	test("it should get a 401 (Unauthorized) when a Tech user try to delete a task", async () => {
		const { id: techId, token: techToken } = await createAndLoginUser(techUserData);
		techUserToken = techToken;

		await supertest(api)
			.delete(`/task/${taskId}`)
			.set("Authorization", `Bearer ${techUserToken}`)
			.expect(401)
			.then((response) => {
				const { body } = response;
				expect(typeof body === "object").toBeTruthy();
			})
		})

	test("it should delete a task successfully when deleted by a manager user", async () => {
		await supertest(api)
			.delete(`/task/${taskId}`)
			.set("Authorization", `Bearer ${userToken}`)
			.expect(204)
			.then((response) => {
				const { body } = response;
				expect(typeof body === "object").toBeTruthy();
			})
		})
});

