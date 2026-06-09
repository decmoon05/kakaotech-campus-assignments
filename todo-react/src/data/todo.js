// Todo 객체 생성 팩토리 — 객체 리터럴 직접 사용 금지 (튜터 Robert 피드백 반영)

export function createTodo({ content, date }) {
  const now = Date.now();
  return {
    id: now,
    content: content.trim(),
    done: false,
    date,
    createdAt: now,
  };
}
