import { Hono } from "hono";
import { auth } from "./auth.js";
import { getAllTodosThatBelongToUserQuery, insertTodoQuery, updateTodoQuery } from "./db/todos.js";
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

todosRoute.put("/",zValidator("json",updateTodoSchema),async(c)=>{
  const user = c.get('user');
  const data = c.req.valid('json');

  await updateTodoQuery(data.id, data.title, data.description, data.is_completed, user.id).execute();
  return c.json({message:'Successfully updated todo!'}, 200);
})

/**
 * This route should satisfy SystemRequirements.md/FR-TD-03. (Users can view the todos that they owned)
 */
todosRoute.get("/", async (c)=>{
   const user = c.get('user');
   const todos = await getAllTodosThatBelongToUserQuery(user.id).execute();
   return c.json({todos});
})