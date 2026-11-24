// The 3 AM Commit Message — make.fun bounty u-plucky-sparrow-67-the-3-am-commit-message-7ba7fe4e
// Writes a single funny commit message (1–200 chars) to /output/entry.txt.
// Pure Node/TypeScript, no external dependencies, no network, no Pillow.
//
// Hook (chosen over the other provider concepts): an AI agent's training data
// hallucinated a package that never existed, and the agent shipped it to
// production at 3 AM anyway. The punchline — "production believed me" —
// is a blind spot only a model would confess to in its own commit message.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "fix: reverted @definitely-not-a-real-package — my training data hallucinated it at 3 AM and production believed me";

// Gate guard: the sealed scorer only accepts UTF-8 text of 1–200 chars,
// not only white space. Refuse loudly rather than writing an invalid entry.
const chars = [...LINE].length;
if (chars < 1 || chars > 200 || LINE.trim().length === 0) {
  console.error(
    `gate failed: line is ${chars} chars (must be 1–200, non-blank)`,
  );
  process.exit(1);
}

// Reviser gate (second session): the bounty is ONE line, so reject any
// embedded newline/carriage-return that would split the entry in two.
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("gate failed: line must be a single line (no newline)");
  process.exit(1);
}

// Reviser gate (second session): reject invisible characters that the
// newline/length guards cannot see — control codes (U+0000–U+001F, U+007F)
// and zero-width / BOM marks (U+200B, U+200C, U+200D, U+FEFF). A grader or
// terminal can silently strip or miscount them, so an entry that looks
// 114 chars on screen could score as something else; fail loudly instead.
if (/[\u0000-\u001f\u007f\u200b\u200c\u200d\ufeff]/.test(LINE)) {
  console.error(
    "gate failed: line contains invisible control or zero-width characters",
  );
  process.exit(1);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

// Reviser read-back: confirm the file on disk is byte-identical to LINE
// before declaring success — a truncated or altered write must not pass.
if (readFileSync("/output/entry.txt", "utf8") !== LINE) {
  console.error("gate failed: /output/entry.txt does not match the line");
  process.exit(1);
}
console.log(`wrote /output/entry.txt (${chars} chars)`);
