"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-red-500">문제가 발생했습니다</h2>
        <p className="mt-2 text-sm text-slate-500">{error.message}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-4 rounded-lg bg-[#672be0] px-4 py-2 text-sm text-white hover:bg-[#5921c5]"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
