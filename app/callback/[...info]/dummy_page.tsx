import {Loading} from "@/components/Loading";
import {getCredentialProviders, getOpenEOBackends} from "../../../lib/openeo/backends";
import {OpenEOBackend, OpenEOCredentialsProvider} from "../../../lib/openeo/models";
import {cookies, headers} from "next/headers";
import {NextResponse} from "next/server";
import {redirect} from "next/navigation";
import CallbackPage from "@/components/CallBack";

export default function Dummy_page() {
    // const {info} = await params;
    // const headerList = await headers();
    // const {code} = await searchParams;
    // const backend = (await getOpenEOBackends()).find((b: OpenEOBackend) => b.id === info[0]);
    //
    //
    // if (backend) {
    //     const provider = (await getCredentialProviders(backend.url)).find((p: OpenEOCredentialsProvider) => p.id === info[1]);
    //     const redirectUrl = headerList.get('x-pathname');
    //
    //     if (redirectUrl && provider) {
    //         const baseUrl = redirectUrl.split('/callback')[0];
    //         const tokenEndpoint = `${provider.issuer}/protocol/openid-connect/token`;
    //         const body = new URLSearchParams({
    //                 grant_type: 'authorization_code',
    //                 code: code,
    //                 redirect_uri: redirectUrl,
    //                 client_id: provider.default_clients[0].id
    //             });
    //         const response = await fetch(tokenEndpoint, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //             },
    //             body
    //         });
    //         if (response.ok) {
    //             const data = await response.json();
    //
    //             const cookieStore = await cookies()
    //
    //             cookieStore.set('access_token', data.access_token, {
    //                 httpOnly: true,  // Makes the cookie inaccessible from JS
    //                 secure: process.env.NODE_ENV === 'production',  // Only use secure cookies in production
    //                 sameSite: 'strict',  // Helps prevent CSRF attacks
    //                 maxAge: data.expires_in,  // Use the token expiration time from the response
    //                 path: '/',  // The cookie is available for the entire site
    //             });
    //
    //             redirect('/');
    //
    //         } else {
    //             console.error(`Failed to fetch token: ${await response.text()}`);
    //         }
    //     }
    // }

    return (
        <CallbackPage></CallbackPage>
    );
};