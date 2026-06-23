import type { Todo } from "@/lib/types";
import TodoItem from "./TodoItem";

export default function TodoList({ todos }: { todos: Todo[] }) {
  if (todos.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">
        할 일이 없습니다
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
