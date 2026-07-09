"use client";

interface Props {
  total: number;
  done: number;
}

export default function TaskStats({ total, done }: Props) {
  const todo = total - done;
  const rate = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        marginBottom: 15,
        padding: 10,
        border: "1px solid #eee",
        borderRadius: 6,
        background: "#fafafa",
      }}
    >
      {/* 总任务 */}
      <div>
        <div style={{ fontSize: 12, color: "#888" }}>总任务</div>
        <div style={{ fontSize: 18 }}>{total}</div>
      </div>

      {/* 待完成 */}
      <div>
        <div style={{ fontSize: 12, color: "#888" }}>待完成</div>
        <div style={{ fontSize: 18 }}>{todo}</div>
      </div>

      {/* 已完成 */}
      <div>
        <div style={{ fontSize: 12, color: "#888" }}>已完成</div>
        <div style={{ fontSize: 18 }}>{done}</div>
      </div>

      {/* 完成率 */}
      <div>
        <div style={{ fontSize: 12, color: "#888" }}>完成率</div>
        <div style={{ fontSize: 18 }}>{rate}%</div>
      </div>
    </div>
  );
}