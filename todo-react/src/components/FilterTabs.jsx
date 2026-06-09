const FILTERS = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "done", label: "완료" },
];

export default function FilterTabs({ filter, onChange }) {
  return (
    <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
      {FILTERS.map((f) => {
        const isActive = filter === f.value;
        return (
          <button
            key={f.value}
            type="button"
            onClick={() => onChange(f.value)}
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
