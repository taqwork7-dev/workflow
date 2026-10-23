
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

type DashboardErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function DashboardError({
    error,
    reset,
}: DashboardErrorProps) {
    useEffect(() => {
        console.error("Dashboard error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[70vh] items-center justify-center bg-slate-50/70 p-6">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                    <AlertTriangle size={30} strokeWidth={1.7} />
                </div>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
                    Đã xảy ra lỗi
                </p>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                    Không thể tải dashboard
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    Đã có sự cố khi tải dữ liệu hoặc hiển thị trang. Vui lòng
                    thử lại. Nếu lỗi vẫn tiếp diễn, hãy quay lại sau.
                </p>

                {error.digest && (
                    <p className="mt-4 text-xs text-slate-400">
                        Mã lỗi: {error.digest}
                    </p>
                )}

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                    >
                        <RefreshCw size={16} />
                        Thử lại
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                    >
                        <ArrowLeft size={16} />
                        Về trang chủ
                    </Link>
                </div>
            </section>
        </main>
    );
}