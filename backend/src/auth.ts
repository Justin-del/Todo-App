import { betterAuth } from "better-auth";
import Database from 'better-sqlite3'
import { useEnvironmentVariables } from "./environment_variables.js";

useEnvironmentVariables()

export const auth = betterAuth({
  baseURL:'https://localhost:3000',
  database:new Database('Database.sqlite'),
  emailAndPassword:{
    enabled:true,
    minPasswordLength:15
  },
  trustedOrigins:[process.env.FRONTEND_URL as string, process.env.MOBILE_APP_URL as string],
})