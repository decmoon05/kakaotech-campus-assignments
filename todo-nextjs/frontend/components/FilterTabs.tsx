"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

const FILTERS = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

export default function FilterTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const current = searchParams.get("filter") ?? "all";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("filter");
    } else {
      params.set("filter", value);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
      {FILTERS.map((f) => {
        const isActive = current === f.value;
        return (
          <button
            key={f.value}
            type="button"
            onClick={() => handleChange(f.value)}
            className={
              "flex-1 rounded-md px-3 py-1.5 text-sm transition-colors " +
              (isActive
                ? "bg-white font-medium text-[#672be0] shadow-sm"
                : "text-slate-500 hover:text-slate-700")
            }
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
