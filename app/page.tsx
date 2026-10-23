import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const features = [
  {
    number: "01",
    icon: "◫",
    title: "Quản lý dự án",
    description:
      "Tập hợp dự án, thành viên và công việc tại một nơi. Luôn biết điều gì đang diễn ra.",
  },
  {
    number: "02",
    icon: "✓",
    title: "Theo dõi công việc",
    description:
      "Tạo nhiệm vụ, đặt thời hạn và cập nhật tiến độ để không bỏ lỡ những việc quan trọng.",
  },
  {
    number: "03",
    icon: "↗",
    title: "Nắm bắt tiến độ",
    description:
      "Theo dõi tổng quan công việc đã hoàn thành, đang thực hiện và còn cần xử lý.",
  },
];

const tasks = [
  {
    title: "Thiết kế giao diện trang chủ",
    project: "Website redesign",
    status: "Hoàn thành",
    color: "bg-emerald-50 text-emerald-700",
    progress: "100%",
  },
  {
    title: "Xây dựng API xác thực",
    project: "TaskFlow App",
    status: "Đang làm",
    color: "bg-violet-50 text-violet-700",
    progress: "65%",
  },
  {
    title: "Viết tài liệu dự án",
    project: "TaskFlow App",
    status: "Chưa bắt đầu",
    color: "bg-slate-100 text-slate-600",
    progress: "0%",
  },
];

export default async function HomePage() {
  const session = await auth();

  // Người dùng đã đăng nhập thì chuyển thẳng vào dashboard.
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Navigation */}
      <header className="border-b border-slate-100">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold text-white shadow-sm shadow-violet-200">
              T
            </span>
            <span className="text-xl font-bold tracking-tight">
              TaskFlow
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a
              href="#features"
              className="transition hover:text-violet-600"
            >
              Tính năng
            </a>
            <a
              href="#workflow"
              className="transition hover:text-violet-600"
            >
              Cách hoạt động
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
            >
              Đăng nhập
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              Bắt đầu ngay
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 size-[500px] -translate-x-1/2 rounded-full bg-violet-100/60 blur-[110px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
              <span className="size-2 rounded-full bg-violet-500" />
              Không gian làm việc của bạn
            </div>

            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight sm:text-6xl lg:text-7xl">
              Làm việc thông minh.
              <span className="mt-2 block text-violet-600">
                Hoàn thành nhiều hơn.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
              Quản lý dự án, sắp xếp công việc và theo dõi tiến độ trong một
              không gian đơn giản. Tập trung vào điều quan trọng nhất và biến
              kế hoạch thành kết quả.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 sm:w-auto"
              >
                Khám phá TaskFlow
                <span aria-hidden="true">→</span>
              </Link>

              <a
                href="#features"
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
              >
                Tìm hiểu tính năng
              </a>
            </div>

            <p className="mt-5 text-xs text-slate-400">
              Đăng nhập nhanh chóng với tài khoản Google
            </p>
          </div>

          {/* Dashboard preview */}
          <div
            id="workflow"
            className="mx-auto mt-16 max-w-5xl rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/70 sm:mt-20 sm:rounded-3xl sm:p-3"
          >
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50 sm:rounded-2xl">
              <div className="flex min-h-14 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-red-400" />
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span className="size-2.5 rounded-full bg-emerald-400" />
                </div>

                <span className="text-xs font-medium text-slate-400">
                  taskflow.app/dashboard
                </span>

                <span className="size-5" />
              </div>

              <div className="grid min-h-[390px] md:grid-cols-[180px_1fr]">
                {/* Sidebar preview */}
                <aside className="hidden border-r border-slate-200 bg-white p-4 md:block">
                  <div className="mb-8 flex items-center gap-2 text-sm font-bold">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-violet-600 text-xs text-white">
                      T
                    </span>
                    TaskFlow
                  </div>

                  <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Workspace
                  </p>

                  <div className="mb-1 flex items-center gap-3 rounded-lg bg-violet-50 px-3 py-2.5 text-xs font-semibold text-violet-700">
                    <span>▦</span>
                    Tổng quan
                  </div>

                  <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-slate-500">
                    <span>▤</span>
                    Dự án
                  </div>

                  <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-slate-500">
                    <span>✓</span>
                    Công việc
                  </div>
                </aside>

                {/* Preview content */}
                <div className="min-w-0 p-4 sm:p-6 lg:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-400">
                        Tổng quan không gian làm việc
                      </p>
                      <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
                        Tổng quan công việc
                      </h2>
                    </div>

                    <span className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white">
                      + Dự án mới
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-xs text-slate-500">Tổng dự án</p>
                      <p className="mt-3 text-2xl font-bold">08</p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        Dự án đang quản lý
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-xs text-slate-500">Công việc</p>
                      <p className="mt-3 text-2xl font-bold">24</p>
                      <p className="mt-1 text-[11px] text-emerald-600">
                        16 đã hoàn thành
                      </p>
                    </div>

                    <div className="col-span-2 rounded-xl border border-slate-200 bg-white p-4 lg:col-span-1">
                      <p className="text-xs text-slate-500">
                        Tiến độ chung
                      </p>

                      <div className="mt-3 flex items-center gap-3">
                        <p className="text-2xl font-bold">68%</p>

                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full w-[68%] rounded-full bg-violet-500" />
                        </div>
                      </div>

                      <p className="mt-1 text-[11px] text-slate-400">
                        Tất cả dự án
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                      <h3 className="text-sm font-bold">
                        Công việc gần đây
                      </h3>

                      <span className="text-xs font-medium text-violet-600">
                        Xem tất cả →
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {tasks.map((task) => (
                        <div
                          key={task.title}
                          className="flex items-center gap-3 px-4 py-4"
                        >
                          <span
                            className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${
                              task.progress === "100%"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {task.progress === "100%" ? "✓" : "○"}
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">
                              {task.title}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-400">
                              {task.project}
                            </p>
                          </div>

                          <span
                            className={`hidden rounded-md px-2 py-1 text-[10px] font-medium sm:inline-flex ${task.color}`}
                          >
                            {task.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="mt-3 text-center text-[10px] text-slate-400">
                    Bản xem trước minh họa giao diện TaskFlow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-t border-slate-100 bg-slate-50/70 px-5 py-20 sm:px-8 sm:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-violet-600">
              ĐƠN GIẢN HÓA CÔNG VIỆC
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Mọi thứ bạn cần.
              <span className="block text-slate-400">
                Trong một nơi duy nhất.
              </span>
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              Tập trung vào công việc thay vì mất thời gian quản lý chúng.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-200 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-violet-50 text-xl font-semibold text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                    {feature.icon}
                  </span>

                  <span className="text-sm font-medium text-slate-300">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-7 text-lg font-bold">{feature.title}</h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-violet-600 px-6 py-14 text-center text-white sm:px-12 sm:py-16">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-semibold text-violet-200">
              SẴN SÀNG BẮT ĐẦU?
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              Biến kế hoạch thành kết quả.
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-violet-100 sm:text-base">
              Tổ chức dự án tốt hơn, theo dõi công việc rõ ràng hơn và làm chủ
              tiến độ của bạn với TaskFlow.
            </p>

            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-violet-700 transition hover:bg-violet-50"
            >
              Bắt đầu với TaskFlow
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-5 py-7 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-violet-600 text-xs font-bold text-white">
              T
            </span>
            <span className="text-sm font-bold">TaskFlow</span>
          </Link>

          <p className="text-center text-xs text-slate-400">
            Quản lý công việc dễ dàng hơn, mỗi ngày.
          </p>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} TaskFlow
          </p>
        </div>
      </footer>
    </main>
  );
}