import { betterAuth } from "better-auth";
import Database from 'better-sqlite3'
import 'dotenv/config'

export const auth = betterAuth({
  baseURL:'http://localhost:3000',
  database:new Database('Database.sqlite'),
  emailAndPassword:{
    enabled:true,
    minPasswordLength:15
  },
  trustedOrigins:[process.env.FRONTEND_URL as string],
})