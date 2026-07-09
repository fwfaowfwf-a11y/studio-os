"use client";

import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { Task } from "@/types/task";
import { supabase } from "@/lib/supabase";

type Status = "todo" | "doing" | "done";

export default function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const [dragTask, setDragTask] = useState<Task | null>(null);

  const columns: { key: Status; title: string }[] = [
    { key: "todo", title: "待处理" },
    { key: "doing", title: "进行中" },
    { key: "done", title: "已完成" },
  ];

  async function updateStatus(task: Task, status: Status) {
    await supabase
      .from("tasks")
      .update({ status })
      .eq("id", task.id);
  }

  return (
    <div style={{ display: "flex", gap: 10 }}>
      {columns.map((col) => (
        <KanbanColumn
          key={col.key}
          title={col.title}
          tasks={tasks.filter((t: any) => t.status === col.key)}
          onDragStart={(task) => setDragTask(task)}
          onDropTask={() => {
            if (dragTask) {
              updateStatus(dragTask, col.key);
              setDragTask(null);
            }
          }}
        />
      ))}
    </div>
  );
}