import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { auth } from './auth.js'
import { cors } from 'hono/cors';
import { useEnvironmentVariables } from './environment_variables.js';
import { todosRoute } from './todos.js';

export const app = new Hono()

useEnvironmentVariables();

app.use( 
	"/api/auth/*", 
	cors({ 
		origin: [process.env.FRONTEND_URL as string, process.env.MOBILE_APP_URL as string],
		credentials: true, 
		allowHeaders:['Content-Type']
	}), 
); 

app.all("/api/auth/*", (c) => auth.handler(c.req.raw));
app.route("/api/todos", todosRoute);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
