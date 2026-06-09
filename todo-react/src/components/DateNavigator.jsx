import { formatDateLabel } from "../utils/date";

export default function DateNavigator({ selectedDate, onShiftDay }) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => onShiftDay(-1)}
        className="rounded-lg px-3 py-1 text-sm text-slate-500 hover:bg-slate-100"
      >
        ◀ 이전
      </button>
      <span className="text-sm font-medium text-slate-700">
        {formatDateLabel(selectedDate)}
      </span>
      <button
        type="button"
        onClick={() => onShiftDay(1)}
        className="rounded-lg px-3 py-1 text-sm text-slate-500 hover:bg-slate-100"
      >
        다음 ▶
      </button>
    </div>
  );
}
