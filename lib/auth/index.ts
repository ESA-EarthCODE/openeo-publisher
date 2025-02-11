'use server'

import {signIn} from "../../auth";

export async function signInGitHub() {
    return await signIn('github', { redirectTo: '/'})
}