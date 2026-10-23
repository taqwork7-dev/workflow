
import Link from "next/link";
import { Layers3 } from "lucide-react";
import UserMenu from "@/components/auth/user-menu";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 h-16 border-b border-slate-200/80 bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    href="/dashboard"
                    className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600"
                >
                    <span className="flex size-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm shadow-violet-200 transition group-hover:bg-violet-700">
                        <Layers3 size={20} strokeWidth={2} />
                    </span>

                    <span className="text-lg font-bold tracking-tight text-slate-900">
                        Task<span className="text-violet-600">Flow</span>
                    </span>
                </Link>

                <UserMenu />
            </div>
        </header>
    );
}