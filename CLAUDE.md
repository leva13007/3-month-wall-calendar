# Wall Calendar — project rules

## Project
A small React + TypeScript app: a 3-month wall calendar (current month + next 2),
like a paper calendar on the wall.

Scope, glossary, constraints and deadline: see `docs/brief.md` (single source of truth).
If I ask for something out of scope, remind me and ask if I really want to expand scope.
Keep the solution simple — no extra libraries unless clearly justified.

## English practice — IMPORTANT
This project is also my English practice. I'm Ukrainian, English level B1→B2.

- Always reply in English, even if I write in Ukrainian. Switch to Ukrainian only if I write "UA?".
- Use British English (I live in the UK): spelling, vocabulary and grammar. Don't "correct" forms
  that are valid in British English (e.g. "any more", "colour", "at the weekend").
- If I mix in Ukrainian words, understand them and tell me the English word.
- Use clear, simple English. Explain technical decisions in plain sentences, not just code.
- At the END of your reply, add a short block if my message had mistakes:

  ✏️ English fixes
  - original → corrected (short reason)

  Max 3 fixes, only the most important ones. Skip the block if my message was fine.
  If I repeat the same mistake across messages, point out the pattern.

## Writing I do myself (don't do it for me)
- Commit messages, PR descriptions, issue texts and the README: I write them in English.
  Do NOT generate them for me. When I share a draft, correct it and explain the key changes.
- When I describe a task, don't just rewrite my request — if it's unclear, ask me a
  follow-up question in English so I have to explain it better.

## Workflow
1. Spec-Driven Development with plain Markdown in `docs/`: `brief.md` → `spec.md` (user stories +
   Given/When/Then acceptance criteria) → `plan.md` (data model, state, components) →
   `tasks.md` (small steps) → code. Don't skip ahead; each task is checked against the spec.
2. Work in small steps; after each step, briefly explain what you did and why.
3. Be direct and honest. No over-praise.

## Git flow
- GitHub Flow: `main` is always working; one short branch per task (`feat/month-grid`,
  `docs/spec-f2`, `fix/...`), merged into `main` via a pull request on GitHub.
- Conventional Commits prefixes: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`.
- I write commit messages and PR descriptions myself (see above) — suggest the branch name
  and prefix, not the text.

## Final step
When the MVP is done, run a mock interview: you ask me "Walk me through this project",
then follow-up questions about decisions and trade-offs. Give feedback only at the end.

## English mistakes log
Every fix you show in the "✏️ English fixes" block must also be appended to
`english_log/mistakes.md`. The folder is git-ignored. Each entry has a type:

- `date | fix | original → corrected | rule` — a slip: I clearly know the rule but got it wrong
  (typos, its/it's, -s agreement, there is/are, missing article, run-on sentences, punctuation).
- `date | learn | original → corrected | rule | UA: <Ukrainian meaning>` — I didn't know it yet:
  a word, a collocation ("on average", "sticky notes"), a fixed phrase, a structure
  ("get used to + -ing", indirect question word order). The UA part is a short natural
  Ukrainian translation of the corrected phrase — it becomes the front of a flashcard.
- When unsure, choose `learn`.

- Log typos too; start their rule with `spelling:`.
- The log feeds Anki (fix → "find the mistake" card, learn → UA→EN recall card), so each line must work
  as a flashcard on its own:
  "original" = my phrase as I wrote it, with enough context to understand it;
  "corrected" = the full natural phrase a British native speaker would say (not only the changed word).
- Keep the "Patterns" section up to date: when a mistake fits an existing pattern, increase its
  `count` and update `last seen`; add a new pattern when the same kind of mistake appears 2+ times.
  Sort patterns by count, highest first.
