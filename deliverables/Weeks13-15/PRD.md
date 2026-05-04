# Writing PRDs for AI: The Good, the Bad, and the Ugly

A practical guide to writing Product Requirements Documents that actually produce working software when handed to an AI coding agent (Claude Code, Cursor, etc.).

---

## Why it matters

A PRD (Project Requirements Document) written for a human teammate assumes shared context, judgment about edge cases, and the ability to ask follow-up questions. A PRD written for an AI agent assumes none of that. The agent has exactly what's in the document plus what it can see in the repo. Ambiguity in the PRD becomes either (a) the agent guessing wrong and confidently shipping broken code, or (b) the agent stopping every 30 seconds to ask clarifying questions.

The goal is a document specific enough that a competent agent can execute end-to-end, while still leaving room for the agent to make sensible local decisions.

---

## The Anatomy of a Good PRD for AI

### 1. Context block (the "why")

Two or three paragraphs at the top. What problem are we solving? Who is it for? What's the current state? What does success look like? The agent uses this to break ties when the spec is ambiguous. If the AI knows you're optimizing for "TA grading throughput on a Linux box," it won't propose a cloud-hosted React Native app.

### 2. Scope, with explicit non-goals

A bulleted list of what's in scope and a separate list of what's out of scope. The non-goals list is the more important of the two. AI agents are eager junior devs. Without a non-goals list, you'll get authentication, dark mode, a settings panel.

### 3. Functional requirements as testable statements

Not "the system should handle errors gracefully". That's a vibe, not a requirement. Instead: "If the input file is not valid, the program writes the offending byte offset to stderr and exits with code 2." Each requirement should map cleanly to a test case.

### 4. Tech stack and constraints

Languages, frameworks, runtime versions, OS targets, dependencies you want or want to avoid. If you have opinions ("no ORM, raw SQL only" or "stick to the standard library"), say so. Otherwise the agent picks something reasonable but possibly different from what your team uses.

### 5. Data model and interfaces

Schemas, API shapes, file formats, CLI signatures. If two components talk to each other, define the contract. This is where most "the AI built two halves that don't fit together" failures originate.

### 6. Acceptance criteria

A numbered checklist the agent can self-verify against. "Running `make test` exits 0. Running `./tool sample.csv` produces `out.json` matching `expected.json` byte-for-byte. Coverage is at least 80% on `core/`." Concrete, mechanical, checkable.

### 7. Open questions

A short list of things you haven't decided. Tells the agent: pause and ask before guessing here.

---

## The Bad: anti-patterns that wreck AI output

**Vague verbs.** "Optimize," "improve," "enhance," "make robust." These have no acceptance criteria. Replace with measurable targets or remove.

**Hidden requirements in prose.** Burying "must work offline" inside a paragraph about user personas. The agent will miss it. Pull constraints into a list.

**Conflicting requirements.** "Must be fully type-safe" and "use this dynamic plugin system" in the same doc. The agent will pick one and silently violate the other. Resolve conflicts before handing off.

**Implementation dictated, but incompletely.**  Don't have no schema, no key naming convention, no TTL policy. Either fully specify or leave the choice to the agent. Half-specifying is worse than not specifying.

**No examples.** A spec without at least one worked example (sample input, sample output) leaves too much room. Even a 3-line example resolves dozens of ambiguities.

**Walls of text.** A 12-page PRD with no headings is something the agent will summarize back to you incorrectly. Use structure.

---

## The Ugly: things that look fine until they bite you

**Implicit environment assumptions.** "Read the config from the usual place." What's usual? `~/.config/app/`? `/etc/app.conf`? An env var? The agent will pick one and you'll discover the mismatch in production.

**Stale context.** PRD references "the existing auth system" but the auth system was rewritten three months ago. The agent reads the PRD, looks at the repo, sees a mismatch, and picks one. Refresh the PRD against the actual code before handing it off.

**Missing failure modes.** What happens on network timeout? Partial writes? Concurrent runs? If the PRD doesn't say, the agent invents behavior, and that behavior probably isn't what you want.

**Over-specifying the solution, under-specifying the problem.** Telling the agent the exact 14 functions to write is brittle. if assumption #3 is wrong, all 14 are wrong. Specify the problem and the contracts; let the agent solve within those constraints.

**No log of decisions.** Three sessions in, you've forgotten that you told the agent to use SQLite instead of Postgres, and the agent has forgotten too because you started a new session. Look into `.claude`.

---

## Things to look out for during execution

- **Scope creep in the agent's output.** It built the thing. And three other things. Cut them. Don't merge "while I was in there" extras without review.
- **Confident hallucinations of APIs.** The agent calls a function that doesn't exist on the library version you're using. Always run the code, not just read it.
- **Silent constraint violations.** Asked for no external dependencies, got a 40-line `package.json`. Diff against expectations.
- **Tests that test the implementation, not the requirement.** The agent writes tests that pass because they assert what the code does, not what the spec says. Spot-check tests against the PRD acceptance criteria.
- **Drift between the PRD and the code.** After two rounds of changes, the code no longer matches the doc. Update the PRD as you go, or it becomes a lie.

---

## The `.claude/` directory pattern

Stop relying on a single mega-prompt. Split the agent's working memory into purpose-specific files in a `.claude/` directory at the repo root. Each session, the agent loads what it needs.

Recommended layout:

```
.claude/
├── CONTEXT.md         # Refreshes the agent's brain on the project
├── PRD.md             # The actual product requirements
├── DECISIONS.md       # Running log of decisions and their rationale
├── LOG.md             # Append-only session log of what was done
├── TESTS.md           # Test plan, fixtures, and how to run them
├── CONVENTIONS.md     # Code style, naming, structural rules
├── GLOSSARY.md        # Domain terms (especially valuable in unfamiliar domains)
└── OPEN-QUESTIONS.md  # Things to resolve before proceeding
```

### What goes in each file

**CONTEXT.md** — One page. Project name, one-paragraph description, who uses it, what tech stack, where the code lives, how to run it locally. This is the file you point a fresh agent session at first. Keep it under 200 lines.

**PRD.md** — The full requirements document. Stable; updated deliberately, not casually.

**DECISIONS.md** — One entry per significant decision: date, what was decided, why, what alternatives were rejected. This is the institutional memory. When the agent later asks "should I use X or Y?" you point it at this file and it sees you already decided.

**LOG.md** — Append-only. Each session, the agent writes a short entry: what was attempted, what worked, what didn't, where it left off. Next session starts by reading the last few entries.

**TESTS.md** — How testing works for this project. Test runner, fixture locations, what's covered, what's deliberately not covered, how to add new tests. Also a good place for sample inputs and expected outputs.

**CONVENTIONS.md** — Naming, formatting, error handling style, logging patterns, what a "good" function/module looks like in this codebase. Saves you from re-explaining it every session.

**GLOSSARY.md** — Domain terms. Especially valuable for projects with jargon (a FAT12 filesystem project should explain "cluster," "FAT chain," "directory entry"). The agent stops misusing terms.

**OPEN-QUESTIONS.md** — Things you and the agent flagged but haven't resolved. Reviewed at the start of each session. Items move out (to DECISIONS.md when resolved) rather than accumulating forever.

### How to use them in a session

Start each session with: "Read `.claude/CONTEXT.md` and the last 3 entries of `.claude/LOG.md`. Confirm what you understand the current state to be before doing anything." This forces the agent to refresh and prevents the "starts coding immediately based on stale assumptions" failure mode.

End each session with: "Append a LOG.md entry covering what you did, what's next, and any new open questions." This is the single most underused habit in agent-driven development.

---

## A minimal PRD template

```markdown
# [Project Name] PRD

## Context
[2-3 paragraphs: problem, users, current state, success criteria]

## Scope
### In scope
- [bullet]

### Out of scope (non-goals)
- [bullet]

## Functional requirements
1. [Testable statement]
2. [Testable statement]

## Non-functional requirements
- Performance: [target]
- Reliability: [target]
- Security: [target]

## Tech stack and constraints
- Language/runtime: [version]
- Frameworks: [list, or "none"]
- Forbidden: [list, e.g. "no ORMs"]

## Data model
[Schemas, types, file formats]

## Interfaces
[CLI signatures, API shapes, function contracts]

## Acceptance criteria
- [ ] [Mechanical, checkable item]
- [ ] [Mechanical, checkable item]

## Open questions
1. [Question]
```

---

## Quick checklist before you hand a PRD to an agent

1. Could a stranger read this and produce roughly the right thing?
2. Is every requirement testable, or at least observable?
3. Are non-goals explicit?
4. Is there at least one worked example?
5. Have I refreshed the doc against the current code?
6. Have I resolved the obvious internal contradictions?
7. Is the `.claude/` directory set up and current?
8. Have I told the agent how to log its work?
