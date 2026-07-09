"use client";

import KanbanCard from "./KanbanCard";
import { Task } from "@/types/task";

export default function KanbanColumn({
  title,
  tasks,
  onDropTask,
  onDragStart,
}: {
  title: string;
  tasks: Task[];
  onDropTask: () => void;
  onDragStart: (task: Task) => void;
}) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDropTask}
      style={{
        flex: 1,
        padding: 10,
        background: "#f7f7f7",
        borderRadius: 10,
        minHeight: 400,
      }}
    >
      <h3>{title}</h3>

      {tasks.map((task) => (
        <KanbanCard
          key={task.id}
          task={task}
          onDragStart={onDragStart}
        />
      ))}
    </div>
  );
}