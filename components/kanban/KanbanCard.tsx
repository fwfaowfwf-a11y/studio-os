"use client";

import { Task } from "@/types/task";

export default function KanbanCard({
  task,
  onDragStart,
}: {
  task: Task;
  onDragStart: (task: Task) => void;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(task)}
      style={{
        padding: 10,
        marginBottom: 10,
        background: "#fff",
        border: "1px solid #eee",
        borderRadius: 8,
        cursor: "grab",
      }}
    >
      <div style={{ fontWeight: 500 }}>{task.title}</div>

      <div style={{ fontSize: 12, opacity: 0.6 }}>
        {task.priority}
      </div>
    </div>
  );
}