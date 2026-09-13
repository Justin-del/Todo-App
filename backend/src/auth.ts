import { betterAuth } from "better-auth";
import { useEnvironmentVariables } from "./environment_variables.js";
import { sqlite } from "./db/database.js";

useEnvironmentVariables()

export const auth = betterAuth({
  baseURL:'https://localhost:3000',
  database:sqlite,
  emailAndPassword:{
    enabled:true,
    minPasswordLength:15
  },
  trustedOrigins:[process.env.FRONTEND_URL as string, process.env.MOBILE_APP_URL as string],
})