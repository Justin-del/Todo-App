import { Hono } from "hono";
import { auth } from "./auth.js";
import { db } from "./db/database.js";

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



/**
 * This route should satisfy SystemRequirements.md/FR-TD-03. 
 */
todosRoute.get("/", async (c)=>{
   const user = c.get('user');

   const todos = await db
    .selectFrom("todo")
    .select(["id", "title", "description", "is_completed"])
    .where("user_id", "=", user.id)
    .execute();

    return c.json({todos});
})