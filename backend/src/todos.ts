import { Hono } from "hono";
import { auth } from "./auth.js";
import { deleteTodoQuery, getAllTodosThatBelongToUserQuery, insertTodoQuery, toggleTodoCompletionStatusQuery, updateTodoQuery } from "./db/todos.js";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

type Env = {
  Variables: {
    // Extract the User type directly from Better Auth instance
    user: typeof auth.$Infer.Session.user;
  };
};

export const todosRoute = new Hono<Env>();

todosRoute.use("*", async(c,next)=>{
    const session = await auth.api.getSession({
        headers:c.req.raw.headers
    })

    const is_there_session = session?.session !== undefined;
    if (!is_there_session){
        return c.json({error:'Unauthorized'},401);
    }

    // Attach session data to request context
    c.set('user',session.user);
    await next();
});

const createTodoSchema = z.object({
  id:z.uuid(),
  title:z.string().trim().min(1),
  description:z.string(),
  is_completed:z.union([z.literal(0), z.literal(1)]),
});

/**
 * This route should satisfy SystemRequirements.md/FR-TD-01. (Users can create todo)
 */
todosRoute.post("/",zValidator("json",createTodoSchema),async(c)=>{
  const user = c.get('user');
  const data = c.req.valid('json');
  await insertTodoQuery(data.id, data.title, data.description, data.is_completed, user.id).execute();
  return c.json({message:'Successfully added todo!'},201)
})

const updateTodoSchema = z.object({
  id:z.uuid(),
  title:z.string().trim().min(1),
  description:z.string(),
  is_completed:z.union([z.literal(0), z.literal(1)]),
})

/**
 * This route should satisfy SystemRequirements.md/FR-TD-02 (Users can edit todos that they owned)
 */
todosRoute.put("/",zValidator("json",updateTodoSchema),async(c)=>{
  const user = c.get('user');
  const data = c.req.valid('json');

  await updateTodoQuery(data.id, data.title, data.description, data.is_completed, user.id).execute();
  return c.json({message:'Successfully updated todo!'}, 200);
})

const toggleTodoCompletionStatusSchema = z.object({
  id:z.uuid(),
  is_completed:z.union([z.literal(0),z.literal(1)])
})

/**
 * This route should satisfy SystemRequirements.md/FR-TD-03 (Users can toggle the completion status of todos that they owned.)
 */
todosRoute.patch("/completion-status", zValidator("json", toggleTodoCompletionStatusSchema), async(c)=>{
  const user = c.get('user');
  const data = c.req.valid('json');

  await toggleTodoCompletionStatusQuery(data.id,data.is_completed, user.id).execute();
  return c.json({message:'Successfully updated todo!'}, 200);
})

/**
 * This route should satisfy SystemRequirements.md/FR-TD-04. (Users can view the todos that they owned)
 */
todosRoute.get("/", async (c)=>{
   const user = c.get('user');
   const todos = await getAllTodosThatBelongToUserQuery(user.id).execute();
   return c.json({todos});
})

const deleteTodoSchema = z.object({
  id:z.uuid(),
})

/**
 * This route should satisfy SystemRequirements.md/FR-TD-05. (Users can remove the todos that they owned.)
 */
todosRoute.delete("/",zValidator("json",deleteTodoSchema),async(c)=>{
  const user = c.get('user');
  const data = c.req.valid('json');
  await deleteTodoQuery(data.id, user.id).execute();
  return c.json('Successfully deleted todo.', 200);
})