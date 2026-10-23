
export default function EditProjectLoading() {
  return (
    <main className="mx-auto max-w-2xl animate-pulse space-y-6 p-6 md:p-8" aria-busy="true">
      <div className="h-9 w-64 rounded bg-gray-200" />
      <div className="h-4 w-80 max-w-full rounded bg-gray-200" />

      <section className="space-y-5 rounded-xl border border-gray-200 p-6">
        <div className="h-4 w-28 rounded bg-gray-200" />
        <div className="h-10 rounded bg-gray-200" />
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="h-28 rounded bg-gray-200" />
        <div className="h-10 w-32 rounded bg-gray-200" />
      </section>
    </main>
  );
}
