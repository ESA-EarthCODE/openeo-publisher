import {Metadata} from "next";
import {Wizard} from "@/components/Wizard";
import {useSearchParams} from "next/navigation";

export const metadata: Metadata = {
    title: 'EarthCODE - openEO Job Publisher',
    description: 'Publishing your job results to EarthCODE',
}

export default function Page() {
    return <div className='bg-white rounded-lg px-10 py-14 shadow-lg'>
        <Wizard></Wizard>
    </div>
}
