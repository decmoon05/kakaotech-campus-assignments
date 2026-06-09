import { getWeekDates, toDateString } from "../utils/date";

const DAY_NAMES = ["월", "화", "수", "목", "금", "토", "일"];

export default function WeekView({
  selectedDate,
  todos,
  onSelectDate,
  onShiftWeek,
}) {
  const week = getWeekDates(selectedDate);
  const today = toDateString(new Date());

  function countByDate(dateStr) {
    return todos.filter((t) => t.date === dateStr).length;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => onShiftWeek(-1)}
          className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
        >
          ◀ 이전 주
        </button>
        <span className="text-xs text-slate-400">주간 보기</span>
        <button
          type="button"
          onClick={() => onShiftWeek(1)}
          className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
        >
          다음 주 ▶
        </button>
      </div>

      <ul className="grid grid-cols-7 gap-1">
        {week.map((dateStr, i) => {
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === today;
          const count = countByDate(dateStr);
          const dayNum = new Date(dateStr).getDate();

          let cls = "flex flex-col items-center rounded-lg py-2 text-xs cursor-pointer ";
          if (isSelected) {
            cls += "bg-[#672be0] text-white";
          } else if (isToday) {
            cls += "bg-[#672be0]/10 text-[#672be0] font-medium";
          } else {
            cls += "text-slate-500 hover:bg-slate-100";
          }

          return (
            <li
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={cls}
            >
              <span>{DAY_NAMES[i]}</span>
              <span className="mt-1 text-base font-medium">{dayNum}</span>
              <span className="mt-0.5 h-3 text-[10px]">
                {count > 0 ? `${count}개` : ""}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
