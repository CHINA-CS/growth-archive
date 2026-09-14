"use client";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="btn-tale btn-tale-fill">
      打印 / 导出 PDF
    </button>
  );
}
