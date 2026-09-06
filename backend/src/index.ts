import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { auth } from './auth.js';
import { cors } from 'hono/cors';
import 'dotenv/config'

const app = new Hono()

app.use( 
	"/api/auth/*", 
	cors({ 
		origin: process.env.FRONTEND_URL, 
		credentials: true, 
	}), 
); 

app.all("/api/auth/*", (c) => auth.handler(c.req.raw)); 

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
