"use client";

interface Props {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "确认",
  cancelText = "取消",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onCancel}
    >
      {/* 弹窗主体 */}
      <div
        style={{
          width: 300,
          background: "#fff",
          padding: 20,
          borderRadius: 8,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <h3 style={{ marginBottom: 10 }}>{title}</h3>

        {/* 描述 */}
        {description && (
          <p style={{ fontSize: 13, color: "#666" }}>
            {description}
          </p>
        )}

        {/* 按钮区 */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 20,
          }}
        >
          <button onClick={onCancel}>
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            style={{
              background: "#e53935",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: 4,
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}