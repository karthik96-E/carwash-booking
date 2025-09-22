import React from "react";

export default function Pagination({ page, total, limit, onChange }) {
  const pages = Math.ceil(total / limit) || 1;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
      <button onClick={() => onChange(Math.max(1, page-1))} disabled={page<=1}>Prev</button>
      <span>Page {page} / {pages}</span>
      <button onClick={() => onChange(Math.min(pages, page+1))} disabled={page>=pages}>Next</button>
    </div>
  );
}
