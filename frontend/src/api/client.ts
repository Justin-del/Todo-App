import { PUBLIC_SERVER_URL } from "$env/static/public";
import type {AppType} from "../../../backend/src"
import {hc} from 'hono/client'

const client = hc<AppType>(PUBLIC_SERVER_URL,{
    init:{
        credentials:'include'
    }
});

/**
 * This is based on SystemRequirements.md/FR-TD-01.
 * @param id 
 * @param title 
 * @param description 
 * @param is_completed 
 * @returns 
 */
export async function addTodo(id:string, title:string, description:string){
    const response = await client.api.todos.$post({
        json:{id,
        title,
        description,
        }
    })
    return response;
}

/**
 * This is based on SystemRequirements.md/FR-TD-02.
 * @param id 
 * @param title 
 * @param description 
 * @param is_completed 
 * @returns 
 */
export async function editTodo(id:string, title:string, description:string, is_completed:0|1){
    const response = await client.api.todos.$put({
        json:{id,
        title,
        description,
        is_completed
        }
    })
    return response;
}

/**
 * This is based on SystemRequirements.md/FR-TD-03.
 * @param id 
 * @param is_completed 
 * @returns 
 */
export async function toggleTodoCompletionStatus(id:string,is_completed:0|1){
    const response = await client.api.todos["completion-status"].$patch({
        json:{
            id,
            is_completed
        }
    })
    return response;
}

/**
 * This is based on SystemRequirements.md/FR-TD-04.
 * @returns 
 */
export async function getTodos(){
    const response = await client.api.todos.$get();
    return response;
}

/**
 * This is based on SystemRequirements.md/FR-TD-05.
 * @param id 
 * @returns 
 */
export async function removeTodo(id:string){
    const response = await client.api.todos.$delete({json:{id}});
    return response;
}
