import * as z from "zod";

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/g;
const HAS_CONTROL_CHARS = /[\u0000-\u001F\u007F]/;

export const publicSlugSchema = z
  .string()
  .transform((val) => val.normalize("NFKC").trim().toLowerCase())
  .pipe(
    z
      .string()
      .min(1)
      .max(160)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  );

export function parsePublicSlug(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return null;
  }
  const parsed = publicSlugSchema.safeParse(decoded);
  return parsed.success ? parsed.data : null;
}

export type RedirectStatus = 301 | 302 | 307 | 308;

const SAFE_INTERNAL_PATH = /^\/(?!\/)[a-zA-Z0-9\-_/]*$/;
const RESERVED_PREFIXES = ["/admin", "/api"];

function isReservedPath(path: string): boolean {
  const lower = path.toLowerCase();
  return RESERVED_PREFIXES.some(
    (prefix) => lower === prefix || lower.startsWith(`${prefix}/`)
  );
}

// Redirect rows are editable by CMS users, so every target is re-validated at
// read time. Only same-site public paths are allowed: no scheme, no `//host`,
// no backslashes, no query or fragment, and never the private workspace or API.
export function validateRedirectTarget(
  target: unknown,
  status: unknown
): { to: string; status: RedirectStatus } | null {
  if (typeof target !== "string" || target.length === 0 || target.length > 200) {
    return null;
  }
  if (HAS_CONTROL_CHARS.test(target) || target.includes("\\")) return null;
  if (!SAFE_INTERNAL_PATH.test(target)) return null;
  if (target.includes("..") || isReservedPath(target)) return null;
  if (status !== 301 && status !== 302 && status !== 307 && status !== 308) {
    return null;
  }
  return { to: target, status };
}

export function sanitizeInternalHref(href: unknown, fallback = "/kontak"): string {
  if (typeof href !== "string") return fallback;
  const [pathPart, hash] = href.split("#");
  if (!SAFE_INTERNAL_PATH.test(pathPart) || pathPart.includes("..")) {
    return fallback;
  }
  if (isReservedPath(pathPart)) return fallback;
  if (hash !== undefined && !/^[a-zA-Z0-9\-_]{1,60}$/.test(hash)) return fallback;
  return hash ? `${pathPart}#${hash}` : pathPart;
}

export function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(CONTROL_CHARS, " ").trim().slice(0, maxLength);
}

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title: string; text: string };

const MAX_BLOCKS = 80;
const MAX_LIST_ITEMS = 30;

// Article and page bodies are stored as JSON. Only a closed set of block
// shapes is rendered, as plain React text nodes, so stored content can never
// inject markup or script.
export function parseContentBlocks(content: unknown): ContentBlock[] {
  if (typeof content !== "object" || content === null) return [];
  const rawBlocks = (content as { blocks?: unknown }).blocks;
  if (!Array.isArray(rawBlocks)) return [];

  const blocks: ContentBlock[] = [];
  for (const raw of rawBlocks.slice(0, MAX_BLOCKS)) {
    if (typeof raw !== "object" || raw === null) continue;
    const block = raw as Record<string, unknown>;

    if (block.type === "paragraph") {
      const text = cleanText(block.text, 3000);
      if (text) blocks.push({ type: "paragraph", text });
    } else if (block.type === "heading") {
      const text = cleanText(block.text, 200);
      if (text) {
        blocks.push({ type: "heading", level: block.level === 3 ? 3 : 2, text });
      }
    } else if (block.type === "list" && Array.isArray(block.items)) {
      const items = block.items
        .slice(0, MAX_LIST_ITEMS)
        .map((item) => cleanText(item, 600))
        .filter(Boolean);
      if (items.length > 0) blocks.push({ type: "list", items });
    } else if (block.type === "callout") {
      const text = cleanText(block.text, 1200);
      if (text) {
        blocks.push({
          type: "callout",
          title: cleanText(block.title, 120),
          text,
        });
      }
    }
  }
  return blocks;
}

const ID_DATE = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

export function formatDateId(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : ID_DATE.format(date);
}

const LOCAL_IMAGE_PATH = /^\/portfolio\/[a-z0-9-]{1,80}\.(?:jpg|jpeg|png|webp)$/;

export function resolvePortfolioImage(slug: string): string | null {
  const candidate = `/portfolio/${slug}.jpg`;
  return LOCAL_IMAGE_PATH.test(candidate) ? candidate : null;
}
