import { db } from "./database.js";

/**
 * This query should satisfy the data requirements of SystemRequirements.md/FR-TD-01.
 * @param id Should be created randomly using UUID on the frontend.
 * @param title 
 * @param description 
 * @param is_completed
 * @param user_id 
 */
export function insertTodoQuery(id:string, title:string, description:string, is_completed:0|1, user_id:string){
    return db.insertInto("todo").values({
        id,
        description,
        is_completed,
        title,
        user_id
    });
}

/**
 * This query should satisfy the data requirements of SystemRequirements.md/FR-TD-02.
 * @param id 
 * @param title 
 * @param description 
 * @param is_completed 
 * @param user_id 
 */
export function updateTodoQuery(id:string, title:string, description: string, is_completed:0|1, user_id:string){
    return db.updateTable("todo").set({
        title,
        description,
        is_completed
    }).where("id","=",id).where("user_id","=",user_id);
}

export function toggleTodoCompletionStatusQuery(id: string, is_completed:0|1, user_id:string){
    return db.updateTable("todo").set({
        is_completed
    }).where("id","=",id).where("user_id","=",user_id);
}

/**
 * This query should satisfy the data requirements of SystemRequirements.md/FR-TD-04.
 * This query would return todos that belong to the user ordered by created_at asc when executed.
 * @param user_id 
 * @returns 
 */
export function getAllTodosThatBelongToUserQuery(user_id:string){
    return db.selectFrom("todo").select(["id", "title", "description", "is_completed"]).where("user_id", "=", user_id).orderBy("created_at","asc");
}

export function deleteTodoQuery(id:string,user_id:string){
    return db.deleteFrom('todo').where("id","=",id).where("user_id","=",user_id);
}