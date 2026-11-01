"use client";

import React, { useState } from "react";
import { INPUT_CLASS, LABEL_CLASS } from "../constants";
import { slugifyText } from "../utils";

interface UrlFieldProps {
  id: string;
  prefix: string;
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
}

export function UrlField({
  id,
  prefix,
  value,
  onChange,
  placeholder,
}: UrlFieldProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      <span className={LABEL_CLASS}>Alamat Halaman (URL)</span>
      {editing ? (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(slugifyText(e.target.value))}
          placeholder={placeholder}
          aria-describedby={`${id}-hint`}
          className={`${INPUT_CLASS} font-mono`}
        />
      ) : (
        <div className="flex min-h-9 items-center justify-between gap-2 rounded-md border border-dashed border-input bg-muted/30 px-3 py-1">
          <span className="min-w-0 truncate font-mono text-xs text-muted-foreground">
            {prefix}
            <span className="text-foreground">{value || "dibuat-dari-judul"}</span>
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="shrink-0 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Ubah
          </button>
        </div>
      )}
      <p id={`${id}-hint`} className="mt-1 text-[11px] text-muted-foreground">
        {editing
          ? "Hanya huruf kecil, angka, dan tanda hubung. Mengubah alamat artikel yang sudah tayang membuat tautan lama tidak berfungsi."
          : "Dibuat otomatis dari judul. Ubah hanya jika perlu."}
      </p>
    </div>
  );
}
