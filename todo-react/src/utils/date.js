// 날짜 유틸 — 1차의 toISOString 사용 시 발생하던 시간대 버그를 피하기 위해
// 항상 로컬 기준으로 문자열을 만든다 (튜터 Ian 피드백 반영)

export function toDateString(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}`;
}

// dateStr 이 속한 주의 월~일 7개 날짜
export function getWeekDates(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay(); // 일=0, 월=1, ..., 토=6
  const monday = new Date(d);
  monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1));

  const week = [];
  for (let i = 0; i < 7; i++) {
    const t = new Date(monday);
    t.setDate(monday.getDate() + i);
    week.push(toDateString(t));
  }
  return week;
}

export function shiftDateString(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return toDateString(d);
}
