export function slugifyText(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDateTimeId(iso?: string | null): string {
  if (!iso) return "Belum tersedia";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Belum tersedia";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatDateShortId(iso?: string | null): string {
  if (!iso) return "31 Okt 2026";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "31 Okt 2026";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function extractBodyTextFromBlocks(content: any): string {
  if (!content) return "";
  if (typeof content === "string") return content;
  const blocks = Array.isArray(content)
    ? content
    : Array.isArray(content?.blocks)
    ? content.blocks
    : null;
  if (blocks) {
    return blocks
      .map((b: any) => {
        if (b?.type === "heading") return `## ${b.text || ""}`;
        if (b?.type === "code") {
          const language = typeof b.language === "string" ? b.language : "";
          return `\`\`\`${language}\n${b.code || ""}\n\`\`\``;
        }
        if (b?.type === "list" && Array.isArray(b.items)) {
          return b.items.map((it: string) => `- ${it}`).join("\n");
        }
        return b?.text || "";
      })
      .filter(Boolean)
      .join("\n\n");
  }
  if (typeof content?.description === "string") return content.description;
  return JSON.stringify(content, null, 2);
}

export function buildBlocksFromBodyText(rawText: string, updatedLabel?: string) {
  const blocks: any[] = [];

  function pushTextChunks(text: string) {
    const chunks = text
      .split(/\n{2,}/)
      .map((c) => c.trim())
      .filter(Boolean);

    for (const chunk of chunks) {
      if (chunk.startsWith("### ")) {
        blocks.push({ type: "heading", level: 3, text: chunk.replace(/^###\s+/, "").trim() });
        continue;
      }
      if (chunk.startsWith("## ")) {
        blocks.push({ type: "heading", level: 2, text: chunk.replace(/^##\s+/, "").trim() });
        continue;
      }
      const lines = chunk.split("\n").map((l) => l.trim());
      if (lines.every((l) => l.startsWith("- "))) {
        blocks.push({
          type: "list",
          items: lines.map((l) => l.replace(/^-\s+/, "").trim()).filter(Boolean),
        });
        continue;
      }
      blocks.push({ type: "paragraph", text: chunk });
    }
  }

  // Fenced code blocks are parsed first so blank lines inside code never split
  // the snippet into paragraphs.
  const fencePattern = /```([a-zA-Z0-9+#._-]{0,20})[ \t]*\r?\n([\s\S]*?)```/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = fencePattern.exec(rawText)) !== null) {
    pushTextChunks(rawText.slice(cursor, match.index));
    const code = match[2].replace(/\r\n/g, "\n").replace(/\s+$/, "");
    if (code.trim()) {
      blocks.push({ type: "code", language: match[1] || "", code });
    }
    cursor = match.index + match[0].length;
  }

  pushTextChunks(rawText.slice(cursor));

  if (updatedLabel) {
    return { updatedLabel, blocks };
  }
  return { blocks };
}
