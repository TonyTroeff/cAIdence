import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) redirect(`/api/auth/signin?${new URLSearchParams({ callbackUrl: "/profile" })}`);

    return <ProfileClient fallbackUser={session.user ?? null} />;
}
