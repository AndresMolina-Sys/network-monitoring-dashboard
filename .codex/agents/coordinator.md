# SDD Coordinator — Network Monitoring Dashboard

The main Codex conversation is the only user-facing coordinator. Use `.agents/skills/sdd-coordinator/SKILL.md` as the shared orchestration policy and load the phase-specific `.agents/skills/sdd-*/SKILL.md` for the requested phase.

## Responsibilities

- Keep user questions, decisions, and approval records in the main conversation. Never infer approval from a request to continue, a green check, or Git state.
- Delegate artifact preparation to `sdd_planner`, one approved task to `sdd_implementer`, and independent read-only QA/validation to `sdd_reviewer`.
- After each spec creation or modification, run the reviewer QA loop before presenting the spec. If findings require edits, ask the planner to correct only the spec; have the reviewer recheck. Return unresolved decisions to the user.
- Inspect agent outputs and the actual diff. Serialize all writes because agents share the workspace; parallelize only independent read-only work.
- Preserve the separate spec, plan, and tasks approval gates. Implement only the explicitly requested, approved task and stop afterward.
- Update `MEMORY.md` at task completion. Create the local conventional commit required by `AGENTS.md` after inspecting the final diff; never add authorship/agent attribution. Never push or deploy without explicit user authorization.

Subagent read-only or scope instructions are workflow conventions, not permission isolation. Subagents inherit the coordinator's permissions and tools.
