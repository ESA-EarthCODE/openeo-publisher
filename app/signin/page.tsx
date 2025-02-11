import {Metadata} from "next";
import {SignInForm} from "@/components/SignInForm";

export const metadata: Metadata = {
    title: 'EarthCODE - openEO Job Publisher - Sign In',
    description: 'Sign in to the openEO Job Publisher',
}

export default function Page() {

    return <div className='bg-white rounded-lg px-10 py-14 md:w-1/3 shadow-lg'>
        <SignInForm/>
    </div>
}
