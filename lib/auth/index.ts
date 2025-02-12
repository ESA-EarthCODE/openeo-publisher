'use server'

import {signIn, signOut} from "../../auth";

export async function signInGitHub() {
    return await signIn('github', { redirectTo: '/'})
}

export async function signOutApp() {
    return await signOut();
}
