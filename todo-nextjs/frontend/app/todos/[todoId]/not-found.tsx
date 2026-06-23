import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-700">
          해당 할 일을 찾을 수 없습니다
        </h2>
        <p className="text-sm text-slate-500">
          삭제되었거나 잘못된 주소일 수 있습니다
        </p>
        <Link
          href="/todos"
          className="mt-2 rounded-lg bg-[#672be0] px-4 py-2 text-sm text-white hover:bg-[#5921c5]"
        >
          목록으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
