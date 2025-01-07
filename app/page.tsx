import {JobListing} from "@/components/JobListing";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'EarthCODE - openEO Job Publisher',
    description: 'Publishing your job results to EarthCODE',
}

export default function Page() {
    return <JobListing></JobListing>
}
