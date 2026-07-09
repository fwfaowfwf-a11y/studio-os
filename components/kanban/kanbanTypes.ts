import { Task } from "@/types/task";

export type TaskStatus = "todo" | "doing" | "done";

export interface KanbanTask extends Task {
  status: TaskStatus;
}