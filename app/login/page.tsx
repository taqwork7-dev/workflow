
import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            TaskFlow
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Đăng nhập để quản lý công việc và dự án của bạn
          </p>
        </div>

        <form
          action={async () => {
            "use server";

            await signIn("google", {
              redirectTo: "/dashboard",
            });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 48 48"
              className="h-5 w-5"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.02 13.22l7.98 6.19C12.88 13.72 18 9.5 24 9.5Z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.27 5.64c4.25-3.92 7.49-9.72 7.49-17.29Z"
              />
              <path
                fill="#FBBC05"
                d="M10.99 28.59A14.4 14.4 0 0 1 10.22 24c0-1.59.28-3.13.77-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.58 10.78l8.41-6.19Z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.94-2.13 15.93-6.16l-7.27-5.64c-2.02 1.35-4.6 2.15-8.66 2.15-6 0-11.12-4.22-13-9.91l-8.41 6.19C6.51 42.62 14.62 48 24 48Z"
              />
            </svg>

            Tiếp tục với Google
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          Bằng việc tiếp tục, bạn đồng ý sử dụng TaskFlow theo các điều khoản
          của ứng dụng.
        </p>
      </div>
    </main>
  );
}
