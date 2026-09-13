import { describe, expect, it } from "vitest";
import { app } from "./index.js";
import { db } from "./db/database.js";
import { auth } from "./auth.js";

const test_user_1 = {
    email_address:'test@example.com',
    password:'hema-ganesan@999',
    name:'Hema Ganesan'
}

const test_user_2 = {
    email_address:'test2@example.com',
    password:'hema-ganesan@999',
    name:'Hema Ganesan'
}

describe("FR-TD-03 tests",()=>{
    it("should reject unauthenticated requests with 401 Unauthorized", async()=>{
        const res = await app.request("/api/todos",{method:'GET'});
        expect(res.status).toEqual(401);
    })

    it("should get all todos that belong to the user", async()=>{
        //Delete all users first
        await db.deleteFrom('user').execute();

        //Create 2 test users.
        const signUpResult1 = await auth.api.signUpEmail({
            body:{
                email:test_user_1.email_address,
                password:test_user_1.password,
                name:test_user_1.name
            }
        });
        
        const signUpResult2 = await auth.api.signUpEmail({
            body:{
                email:test_user_2.email_address,
                password:test_user_2.password,
                name:test_user_2.name
            }
        });

        //Login for test_user_1.
        const signInResponse = await auth.api.signInEmail({
            body:{
                email: test_user_1.email_address,
                password:test_user_1.password
            },
            asResponse:true
        })

        //Send 2 todos for test_user_1. Send 1 todo for test_user_2.
        await db.insertInto("todo").values([
            {id:crypto.randomUUID(),title:'Todo 1',description:'This is a description.', is_completed:0, user_id:signUpResult1.user.id,created_at:new Date().toISOString(), updated_at:new Date().toISOString()},
            {id:crypto.randomUUID(),title:'Todo 2',description:'', is_completed:1, user_id:signUpResult1.user.id,created_at:new Date().toISOString(), updated_at:new Date().toISOString()},
            {id:crypto.randomUUID(),title:'Todo 3',description:'', is_completed:0, user_id:signUpResult2.user.id,created_at:new Date().toISOString(), updated_at:new Date().toISOString()}
        ]).execute();

        //Query protected route endpoint with the cookie
        const cookieHeaders = signInResponse.headers.get('set-cookie');

        const response = await app.request("/api/todos", {
            method:'GET',
            headers:{
                Cookie:cookieHeaders??""
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