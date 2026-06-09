import { useEffect, useState, useMemo } from "react";
import { toDateString, shiftDateString } from "./utils/date";
import { createTodo } from "./data/todo";
import { useLocalStorageTodos } from "./hooks/useLocalStorageTodos";

import TodoForm from "./components/TodoForm";
import DateNavigator from "./components/DateNavigator";
import WeekView from "./components/WeekView";
import FilterTabs from "./components/FilterTabs";
import TodoList from "./components/TodoList";
import Message from "./components/Message";

export default function App() {
  const [todos, setTodos] = useLocalStorageTodos();
  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() =>
    toDateString(new Date()),
  );
  const [message, setMessage] = useState("");

  // 안내 메시지 자동 소멸
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(() => setMessage(""), 2000);
    return () => clearTimeout(id);
  }, [message]);

  const visibleTodos = useMemo(() => {
    return todos
      .filter((t) => t.date === selectedDate)
      .filter((t) => {
        if (currentFilter === "active") return !t.done;
        if (currentFilter === "done") return t.done;
        return true;
      });
  }, [todos, selectedDate, currentFilter]);

  function handleAdd(content) {
    if (!content.trim()) {
      setMessage("내용을 입력해주세요");
      return;
    }
    setTodos((prev) => [...prev, createTodo({ content, date: selectedDate })]);
  }

  function handleToggle(id) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  }

  function handleRemove(id) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function handleEdit(id, newContent) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, content: newContent } : t)),
    );
  }

  function handleShiftDay(days) {
    setSelectedDate((d) => shiftDateString(d, days));
  }

  function handleShiftWeek(weeks) {
    setSelectedDate((d) => shiftDateString(d, weeks * 7));
  }

  return (
    <main className="flex min-h-full justify-center px-4 py-8">
      <div className="flex w-full max-w-xl flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
        <header className="flex items-baseline justify-between">
          <h1 className="text-xl font-bold text-[#672be0]">Todo</h1>
          <span className="text-xs text-slate-400">React + Tailwind</span>
        </header>

        <WeekView
          selectedDate={selectedDate}
          todos={todos}
          onSelectDate={setSelectedDate}
          onShiftWeek={handleShiftWeek}
        />

        <DateNavigator
          selectedDate={selectedDate}
          onShiftDay={handleShiftDay}
        />

        <TodoForm onAdd={handleAdd} />
        <Message text={message} />

        <FilterTabs filter={currentFilter} onChange={setCurrentFilter} />

        <TodoList
          todos={visibleTodos}
          onToggle={handleToggle}
          onRemove={handleRemove}
          onEdit={handleEdit}
        />
      </div>
    </main>
  );
}
