import { describe, expect, it } from "vitest";
import { buildBlocksFromBodyText, extractBodyTextFromBlocks } from "./utils";

describe("buildBlocksFromBodyText", () => {
  it("keeps fenced code as one block, including blank lines", () => {
    const result = buildBlocksFromBodyText(
      [
        "Paragraf pembuka.",
        "",
        "```ts",
        "const pesan = 'halo';",
        "",
        "console.log(pesan);",
        "```",
        "",
        "Paragraf penutup.",
      ].join("\n")
    );

    expect(result.blocks).toEqual([
      { type: "paragraph", text: "Paragraf pembuka." },
      {
        type: "code",
        language: "ts",
        code: "const pesan = 'halo';\n\nconsole.log(pesan);",
      },
      { type: "paragraph", text: "Paragraf penutup." },
    ]);
  });

  it("still builds headings and lists outside code fences", () => {
    const result = buildBlocksFromBodyText(
      ["## Subjudul", "", "- Satu", "- Dua"].join("\n")
    );

    expect(result.blocks).toEqual([
      { type: "heading", level: 2, text: "Subjudul" },
      { type: "list", items: ["Satu", "Dua"] },
    ]);
  });
});

describe("extractBodyTextFromBlocks", () => {
  it("round-trips a code block back to fenced text", () => {
    const content = {
      blocks: [
        { type: "paragraph", text: "Pengantar." },
        { type: "code", language: "js", code: "console.log('halo');" },
      ],
    };

    expect(extractBodyTextFromBlocks(content)).toBe(
      "Pengantar.\n\n```js\nconsole.log('halo');\n```"
    );
  });

  it("returns an empty string for empty content", () => {
    expect(extractBodyTextFromBlocks(null)).toBe("");
    expect(extractBodyTextFromBlocks({ blocks: [] })).toBe("");
  });
});
