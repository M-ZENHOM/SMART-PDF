import { Auth } from "@/lib/auth";
import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page() {
    const user = await Auth()
    if (user) return redirect('/')
    return <SignUp />;
}