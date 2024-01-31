import { currentUser } from "@clerk/nextjs";

export const Auth = async () => {
    const user = await currentUser();
    return user
}