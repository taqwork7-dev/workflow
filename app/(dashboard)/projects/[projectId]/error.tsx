
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

type ProjectErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function ProjectError({
    error,
    reset,
}: ProjectErrorProps) {
    useEffect(() => {
        console.error("Project page error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
            <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <AlertTriangle className="size-8" />
                </div>

                <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-red-600">
                    Đã xảy ra lỗi
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                    Không thể tải dự án
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                    Đã xảy ra sự cố khi tải thông tin dự án. Vui lòng thử
                    lại sau ít phút.
                </p>

                {error.digest && (
                    <p className="mt-4 text-xs text-gray-400">
                        Mã lỗi: {error.digest}
                    </p>
                )}

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        <RefreshCw className="size-4" />
                        Thử lại
                    </button>

                    <Link
                        href="/dashboard"
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
                    >
                        <ArrowLeft className="size-4" />
                        Về Dashboard
                    </Link>
                </div>
            </section>
        </main>
    );
}
