import { describe, expect, it } from "vitest";
import { app } from "./index.js";
import { db } from "./db/database.js";
import { auth } from "./auth.js";
import { getAllTodosThatBelongToUserQuery, insertTodoQuery } from "./db/todos.js";

const test_user_1 = {
    email_address: 'test@example.com',
    password: 'hema-ganesan@999',
    name: 'Hema Ganesan'
}

const test_user_2 = {
    email_address: 'test2@example.com',
    password: 'hema-ganesan@999',
    name: 'Hema Ganesan'
}

describe("FR-TD-01 tests (Users can create todos)", () => {
    it("should reject unauthenticated requests with 401 Unauthorized", async () => {
        const res = await app.request("/api/todos", { method: 'POST' });
        expect(res.status).toEqual(401);
    })

    it("should allow authenticated users to add todos with valid data.", async () => {
        //Delete all users first
        await db.deleteFrom('user').execute();

        //Create 1 test user.
        const signUpResult = await auth.api.signUpEmail({
            body: {
                email: test_user_1.email_address,
                password: test_user_1.password,
                name: test_user_1.name
            }
        });

        //Login for test_user_1.
        const signInResponse = await auth.api.signInEmail({
            body: {
                email: test_user_1.email_address,
                password: test_user_1.password
            },
            asResponse: true
        })

        const cookie = signInResponse.headers.get('Set-Cookie');

        const todos = [
            {
                id: crypto.randomUUID(),
                title: 'Todo 1',
                description: '',
                is_completed: 0
            },
            {
                id: crypto.randomUUID(),
                title: 'Todo 2',
                description: 'This is a description.',
                is_completed: 1
            }]

        //Add 2 todos for the user.
        const response1 = await app.request("/api/todos", {
            method: 'POST',
            body: JSON.stringify(todos[0]),
            headers: {
                "Content-Type": "application/json",
                Cookie: cookie ?? ""
            }
        })

        const response2 = await app.request("/api/todos", {
            method: 'POST',
            body: JSON.stringify(todos[1]),
            headers: {
                "Content-Type": "application/json",
                Cookie: cookie ?? ""
            }
        })

        //Assertions
        expect(response1.status).toEqual(201);
        expect(response2.status).toEqual(201);

        const saved_todos = await getAllTodosThatBelongToUserQuery(signUpResult.user.id).orderBy("created_at", "asc").execute();

        expect(saved_todos.length).toEqual(2);

        expect(saved_todos[0]).toEqual(todos[0]);
        expect(saved_todos[1]).toEqual(todos[1]);
    })
})

describe("FR-TD-02 tests (Users can edit todos that they owned)", () => {
    it("should reject unauthenticated requests with 401 Unauthorized", async () => {
        const res = await app.request("/api/todos", { method: 'PUT' });
        expect(res.status).toEqual(401);
    })

    it("should allow users to update todos with valid data.", async () => {
        //Delete all users first
        await db.deleteFrom('user').execute();

        //Create 1 test user
        const signUpResult = await auth.api.signUpEmail({
            body: {
                email: test_user_1.email_address,
                password: test_user_1.password,
                name: test_user_1.name
            }
        });

        //Login for test_user_1.
        const signInResponse = await auth.api.signInEmail({
            body: {
                email: test_user_1.email_address,
                password: test_user_1.password
            },
            asResponse: true
        })

        const cookie = signInResponse.headers.get('Set-Cookie');

        //Add two todos for the user.
        const todos = [
            {
                id: crypto.randomUUID(),
                title: 'Todo 1',
                description: '',
                is_completed: 0
            },
            {
                id: crypto.randomUUID(),
                title: 'Todo 2',
                description: 'This is a description.',
                is_completed: 1
            }]

        for (const todo of todos) {
            await insertTodoQuery(todo.id, todo.title, todo.description, todo.is_completed as 0 | 1, signUpResult.user.id).execute();
        }

        const update_payload = {
            id: todos[0].id,
            title: 'Todo A',
            description: 'Ini ialah satu deskripsi.',
            is_completed: 1
        }

        //Update only the user's first todo.
        const response = await app.request("/api/todos", {
            method: 'PUT',
            body: JSON.stringify(update_payload),
            headers: {
                "Content-Type": "application/json",
                Cookie: cookie ?? ""
            }
        })

        //Assertions
        expect(response.status).toEqual(200);

        const saved_todos = await getAllTodosThatBelongToUserQuery(signUpResult.user.id).orderBy("created_at", "asc").execute();

        expect(saved_todos.length).toEqual(2);

        //The first todo should equal to the update payload.
        expect(saved_todos[0]).toEqual(update_payload);

        //The second todo should equal to todos[1] as it's not being updated.
        expect(saved_todos[1]).toEqual(todos[1]);
    })
});

describe("FR-TD-03 tests (Users can toggle the completion status of todos that they owned.)", () => {
    it("should reject unauthenticated requests with 401 Unauthorized", async () => {
        const res = await app.request("/api/todos/completion-status", { method: 'PATCH' });
        expect(res.status).toEqual(401);
    })

    it("should allow authenticated users to toggle completion status of todo", async () => {
        //Delete all users first
        await db.deleteFrom('user').execute();

        //Create 1 test user
        const signUpResult = await auth.api.signUpEmail({
            body: {
                email: test_user_1.email_address,
                password: test_user_1.password,
                name: test_user_1.name
            }
        });

        //Login for test_user_1.
        const signInResponse = await auth.api.signInEmail({
            body: {
                email: test_user_1.email_address,
                password: test_user_1.password
            },
            asResponse: true
        })

        const cookie = signInResponse.headers.get('Set-Cookie');

        //Add three todos for the user.
        const todos = [
            {
                id: crypto.randomUUID(),
                title: 'Todo 1',
                description: '',
                is_completed: 0
            },
            {
                id: crypto.randomUUID(),
                title: 'Todo 2',
                description: 'This is a description.',
                is_completed: 1
            },
            {
                id: crypto.randomUUID(),
                title: 'Todo 3',
                description: 'Ini ialah satu todo.',
                is_completed: 1
            }
        ]

        for (const todo of todos) {
            await insertTodoQuery(todo.id, todo.title, todo.description, todo.is_completed as 0 | 1, signUpResult.user.id).execute();
        }

        //Mark the first todo as completed.
        const response_1 = await app.request("/api/todos/completion-status", {
            method: 'PATCH', body: JSON.stringify({
                id: todos[0].id,
                is_completed: 1
            },), headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie ?? ""
            }
        });

        //Mark the third todo as uncompleted.
        const response_2 = await app.request("/api/todos/completion-status", {
            method: 'PATCH', body: JSON.stringify({
                id: todos[2].id,
                is_completed: 0
            }), headers: {
                'Content-Type': 'application/json',
                "Cookie": cookie ?? ""
            }
        });

        //Assertions
        expect(response_1.status).toEqual(200);
        expect(response_2.status).toEqual(200);

        const saved_todos = await getAllTodosThatBelongToUserQuery(signUpResult.user.id).orderBy('created_at', 'asc').execute();

        expect(saved_todos.length).toEqual(3);

        expect(saved_todos[0].id).toEqual(todos[0].id);
        expect(saved_todos[1].id).toEqual(todos[1].id);
        expect(saved_todos[2].id).toEqual(todos[2].id);

        expect(saved_todos[0].title).toEqual(todos[0].title);
        expect(saved_todos[1].title).toEqual(todos[1].title);
        expect(saved_todos[2].title).toEqual(todos[2].title);

        expect(saved_todos[0].description).toEqual(todos[0].description);
        expect(saved_todos[1].description).toEqual(todos[1].description);
        expect(saved_todos[2].description).toEqual(todos[2].description);

        expect(saved_todos[0].is_completed).toEqual(1);
        expect(saved_todos[1].is_completed).toEqual(1);
        expect(saved_todos[2].is_completed).toEqual(0);
    })
});

describe("FR-TD-04 tests (Users can view todos that they owned.)", () => {
    it("should reject unauthenticated requests with 401 Unauthorized", async () => {
        const res = await app.request("/api/todos", { method: 'GET' });
        expect(res.status).toEqual(401);
    })

    it("should get all todos that belong to the user", async () => {
        //Delete all users first
        await db.deleteFrom('user').execute();

        //Create 2 test users.
        const signUpResult1 = await auth.api.signUpEmail({
            body: {
                email: test_user_1.email_address,
                password: test_user_1.password,
                name: test_user_1.name
            }
        });

        const signUpResult2 = await auth.api.signUpEmail({
            body: {
                email: test_user_2.email_address,
                password: test_user_2.password,
                name: test_user_2.name
            }
        });

        //Login for test_user_1.
        const signInResponse = await auth.api.signInEmail({
            body: {
                email: test_user_1.email_address,
                password: test_user_1.password
            },
            asResponse: true
        })

        //Send 2 todos for test_user_1. Send 1 todo for test_user_2.
        await db.insertInto("todo").values([
            { id: crypto.randomUUID(), title: 'Todo 1', description: 'This is a description.', is_completed: 0, user_id: signUpResult1.user.id },
            { id: crypto.randomUUID(), title: 'Todo 2', description: '', is_completed: 1, user_id: signUpResult1.user.id },
            { id: crypto.randomUUID(), title: 'Todo 3', description: '', is_completed: 0, user_id: signUpResult2.user.id }
        ]).execute();

        //Query protected route endpoint with the cookie
        const cookieHeaders = signInResponse.headers.get('set-cookie');

        const response = await app.request("/api/todos", {
            method: 'GET',
            headers: {
                Cookie: cookieHeaders ?? ""
            }
        })

        //Assertions
        expect(response.status).toEqual(200);

        const body = await response.json();

        //test_user_1 should only have 2 todos.
        expect(body.todos).toHaveLength(2);

        expect(body.todos[0].title).toEqual('Todo 1');
        expect(body.todos[0].description).toEqual('This is a description.');
        expect(body.todos[0].is_completed).toEqual(0);

        expect(body.todos[1].title).toEqual('Todo 2');
        expect(body.todos[1].description).toEqual('');
        expect(body.todos[1].is_completed).toEqual(1);
    })
})

describe("FR-TD-05 tests (Users can remove the todos that they owned.", () => {
    it("should reject unauthenticated requests with 401 Unauthorized", async () => {
        const res = await app.request("/api/todos", { method: 'DELETE' });
        expect(res.status).toEqual(401);
    })

    it("should allow users to remove their todos", async () => {
        //Delete all users first
        await db.deleteFrom('user').execute();

        //Create 1 test user
        const signUpResult = await auth.api.signUpEmail({
            body: {
                email: test_user_1.email_address,
                password: test_user_1.password,
                name: test_user_1.name
            }
        });


        //Login for test_user_1.
        const signInResponse = await auth.api.signInEmail({
            body: {
                email: test_user_1.email_address,
                password: test_user_1.password
            },
            asResponse: true
        })

        const cookie = signInResponse.headers.get('Set-Cookie');

        //Add two todos for test_user_1.

        const todos = [
            {
                id: crypto.randomUUID(),
                title: 'Todo 1',
                description: '',
                is_completed: 0
            },
            {
                id: crypto.randomUUID(),
                title: 'Todo 2',
                description: 'This is a description.',
                is_completed: 1
            }
        ]

        for (const todo of todos) {
            await insertTodoQuery(todo.id, todo.title, todo.description, todo.is_completed as 0 | 1, signUpResult.user.id).execute();
        }

        //Delete only the second todo.
        const response = await app.request("/api/todos", {
            method: 'DELETE',
            body: JSON.stringify({ id: todos[1].id }),
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookie ?? ""
            }
        },)

        //Assertions
        expect(response.status).toEqual(200);

        const saved_todos = await getAllTodosThatBelongToUserQuery(signUpResult.user.id).execute();

        expect(saved_todos.length).toEqual(1);
        expect(saved_todos[0]).toEqual(todos[0]);
    })
})