"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
    <MaxWidthWrapper className="py-20 flex items-center justify-center">
        <UserProfile path="/user-profile" routing="path"  >
            <UserProfile.Page label="account" />
            <UserProfile.Page label="security" />
        </UserProfile>
    </MaxWidthWrapper>

);

export default UserProfilePage;