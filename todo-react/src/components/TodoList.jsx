import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onRemove, onEdit }) {
  if (todos.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-slate-400">
        이 날짜의 할 일이 없습니다
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
