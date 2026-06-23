export type Todo = {
  id: number;
  content: string;
  done: boolean;
  created_at: string;
  updated_at: string;
};

export type TodoCreate = {
  content: string;
};

export type TodoUpdate = {
  content?: string;
  done?: boolean;
};

export type Filter = "all" | "active" | "completed";
