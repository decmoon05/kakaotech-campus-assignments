import { useEffect, useState } from "react";

const STORAGE_KEY = "todos";

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// todos 상태와 localStorage 자동 동기화
// - 초기값은 함수형 초기화로 최초 1회만 읽음
// - todos 가 바뀔 때마다 useEffect 가 자동 저장
export function useLocalStorageTodos() {
  const [todos, setTodos] = useState(readFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // 용량 초과 등 — 조용히 무시 (회고에 한계 명시)
    }
  }, [todos]);

  return [todos, setTodos];
}
