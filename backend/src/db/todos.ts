import { db } from "./database.js";

/**
 * This query should satisfy the data requirements of SystemRequirements.md/FR-TD-03.
 * @param user_id 
 * @returns 
 */
export function getAllTodosThatBelongToUserQuery(user_id:string){
    return db.selectFrom("todo").select(["id", "title", "description", "is_completed"]).where("user_id", "=", user_id);
}

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