"use server";

import { revalidatePath } from "next/cache";
import { backendApi } from "@/lib/api";
import type { Todo, TodoCreate, TodoUpdate } from "@/lib/types";

export async function getTodos(params?: {
  filter?: string;
  search?: string;
}): Promise<Todo[]> {
  const res = await backendApi.get<Todo[]>("/todos", { params });
  return res.data;
}

export async function getTodo(id: number): Promise<Todo | null> {
  try {
    const res = await backendApi.get<Todo>(`/todos/${id}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function createTodo(data: TodoCreate): Promise<void> {
  await backendApi.post<Todo>("/todos", data);
  revalidatePath("/todos");
}

export async function updateTodo(
  id: number,
  data: TodoUpdate,
): Promise<void> {
  await backendApi.put<Todo>(`/todos/${id}`, data);
  revalidatePath("/todos");
  revalidatePath(`/todos/${id}`);
}

export async function deleteTodo(id: number): Promise<void> {
  await backendApi.delete(`/todos/${id}`);
  revalidatePath("/todos");
}
