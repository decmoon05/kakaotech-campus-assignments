import { describe, it, expect } from "vitest";
import type { Todo, TodoCreate, TodoUpdate, Filter } from "../lib/types";

describe("타입 정합성", () => {
  it("Todo 객체가 모든 필수 필드를 가짐", () => {
    const todo: Todo = {
      id: 1,
      content: "테스트",
      done: false,
      created_at: "2026-06-23T00:00:00Z",
      updated_at: "2026-06-23T00:00:00Z",
    };
    expect(todo.id).toBe(1);
    expect(todo.content).toBe("테스트");
    expect(todo.done).toBe(false);
  });

  it("TodoCreate 는 content 만 필요", () => {
    const create: TodoCreate = { content: "새 항목" };
    expect(create.content).toBe("새 항목");
  });

  it("TodoUpdate 는 모든 필드 optional", () => {
    const update1: TodoUpdate = {};
    const update2: TodoUpdate = { content: "수정" };
    const update3: TodoUpdate = { done: true };
    const update4: TodoUpdate = { content: "수정", done: true };
    expect(update1).toBeDefined();
    expect(update2.content).toBe("수정");
    expect(update3.done).toBe(true);
    expect(update4.content).toBe("수정");
    expect(update4.done).toBe(true);
  });

  it("Filter 가 정확히 3개 값만 허용", () => {
    const f1: Filter = "all";
    const f2: Filter = "active";
    const f3: Filter = "completed";
    expect([f1, f2, f3]).toEqual(["all", "active", "completed"]);
  });
});
