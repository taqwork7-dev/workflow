
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Header from "@/components/layout/header";

type DashboardLayoutProps = {
    children: ReactNode;
};

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            {children}
        </div>
    );
}
