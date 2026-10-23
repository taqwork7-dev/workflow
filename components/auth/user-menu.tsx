import { auth, signOut } from "@/auth";

export default async function UserMenu() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return null;
  }

  async function handleSignOut() {
    "use server";

    await signOut({ redirectTo: "/login" });
  }

  const initials =
    user.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(-2)
      .toUpperCase() || "U";

  return (
    <div className="flex items-center gap-3">
      {user.image ? (
        <img
          src={user.image}
          alt={user.name ?? "User avatar"}
          referrerPolicy="no-referrer"
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
          {initials}
        </div>
      )}

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900">
          {user.name ?? "User"}
        </p>
        <p className="truncate text-xs text-slate-500">
          {user.email}
        </p>
      </div>

      <form action={handleSignOut}>
        <button
          type="submit"
          className="rounded-md border border-slate-200 px-3 py-2 text-sm transition hover:bg-slate-100"
        >
          Đăng xuất
        </button>
      </form>
    </div>
  );
}