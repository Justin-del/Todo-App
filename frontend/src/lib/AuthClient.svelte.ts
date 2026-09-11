import { PUBLIC_SERVER_URL } from "$env/static/public"
import { createAuthClient } from "better-auth/svelte"
import { fromStore } from "svelte/store";

export const authClient = createAuthClient({
     baseURL:PUBLIC_SERVER_URL
})

const session = fromStore(authClient.useSession());

const isLoggedIn = $derived.by(
     ()=>{
           const is_there_session = !(session.current.isPending) && (session.current.data?.session !== undefined)

           return is_there_session
     }
)

export function getIsAuthPending() {
  return session.current.isPending;
}


export function getIsLoggedIn(){
     return isLoggedIn;
}