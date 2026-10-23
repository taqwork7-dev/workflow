
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

type TaskFiltersProps = {
  projectId: string;
  search: string;
  status: string;
  priority: string;
};

export function TaskFilters({
  projectId,
  search,
  status,
  priority,
}: TaskFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(search);
  const [statusValue, setStatusValue] = useState(status);
  const [priorityValue, setPriorityValue] = useState(priority);


  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    } else {
      params.delete("search");
    }

    if (statusValue !== "ALL") {
      params.set("status", statusValue);
    } else {
      params.delete("status");
    }

    if (priorityValue !== "ALL") {
      params.set("priority", priorityValue);
    } else {
      params.delete("priority");
    }

    const query = params.toString();
    const url = query
      ? `/projects/${projectId}?${query}`
      : `/projects/${projectId}`;

    startTransition(() => {
      router.replace(url, { scroll: false });
    });
  }

  function clearFilters() {
    setSearchValue("");
    setStatusValue("ALL");
    setPriorityValue("ALL");

    startTransition(() => {
      router.replace(`/projects/${projectId}`, { scroll: false });
    });
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:flex-wrap">
      <input
        type="search"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            applyFilters();
          }
        }}
        maxLength={100}
        placeholder="Tìm tên công việc..."
        className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />

      <select
        value={statusValue}
        onChange={(event) => setStatusValue(event.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        aria-label="Lọc theo trạng thái"
      >
        <option value="ALL">Tất cả trạng thái</option>
        <option value="TODO">Cần làm</option>
        <option value="IN_PROGRESS">Đang thực hiện</option>
        <option value="DONE">Hoàn thành</option>
      </select>

      <select
        value={priorityValue}
        onChange={(event) => setPriorityValue(event.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        aria-label="Lọc theo mức ưu tiên"
      >
        <option value="ALL">Tất cả mức ưu tiên</option>
        <option value="LOW">Thấp</option>
        <option value="MEDIUM">Trung bình</option>
        <option value="HIGH">Cao</option>
        <option value="URGENT">Khẩn cấp</option>
      </select>

      <button
        type="button"
        onClick={applyFilters}
        disabled={isPending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {isPending ? "Đang lọc..." : "Lọc"}
      </button>

      <button
        type="button"
        onClick={clearFilters}
        disabled={isPending}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
}
