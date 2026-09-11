import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from 'dotenv'

export function useEnvironmentVariables(){
    const filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(filename);
    const envPath = path.resolve(dirname,`../.env.${process.env.NODE_ENV?.trim()}`)
    
    const {error} = dotenv.config({path:envPath})
    if (error!==undefined){
        console.log(error)
    }
}