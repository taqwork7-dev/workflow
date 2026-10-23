
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type TaskPaginationProps = {
  projectId: string;
  currentPage: number;
  totalPages: number;
};

export function TaskPagination({
  projectId,
  currentPage,
  totalPages,
}: TaskPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) {
    return null;
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const query = params.toString();
    const url = query
      ? `/projects/${projectId}?${query}`
      : `/projects/${projectId}`;

    startTransition(() => {
      router.replace(url, { scroll: false });
    });
  }

  return (
    <nav
      aria-label="Phân trang công việc"
      className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4"
    >
      <p className="text-sm text-gray-500">
        Trang {currentPage} / {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Trang trước
        </button>

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>
    </nav>
  );
}
