import React from "react";
import type { ContentBlock } from "@/lib/public-validators";

// Blocks render as plain React text nodes. Stored content never reaches
// dangerouslySetInnerHTML, so a compromised CMS row cannot inject markup.
export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="max-w-[72ch] text-[15px] sm:text-[16px] leading-[1.8] text-[#2F4260] dark:text-slate-300">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return block.level === 3 ? (
              <h3
                key={index}
                className="mt-8 text-[18px] sm:text-[20px] font-extrabold text-[#041E42] dark:text-white"
              >
                {block.text}
              </h3>
            ) : (
              <h2
                key={index}
                className="mt-10 text-[21px] sm:text-[26px] font-extrabold leading-snug tracking-[-0.015em] text-[#041E42] dark:text-white"
              >
                {block.text}
              </h2>
            );
          case "list":
            return (
              <ul key={index} className="mt-4 list-disc space-y-2.5 pl-5 marker:text-[#005090]">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <aside
                key={index}
                className="mt-8 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 sm:p-6 dark:border-[#4E6E9E] dark:bg-slate-900"
              >
                {block.title && (
                  <p className="text-[15px] font-extrabold text-[#041E42] dark:text-white">
                    {block.title}
                  </p>
                )}
                <p className={block.title ? "mt-1.5" : ""}>{block.text}</p>
              </aside>
            );
          default:
            return (
              <p key={index} className="mt-4 first:mt-0">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
