# Figma components — agent edit policy

**This rule is mandatory for any AI assistant, agent, or automation working in this repository or on this product.**

## Non-negotiable rule

**Do not create, edit, delete, move, resize, restructure, re-parent, or otherwise mutate any component, component set, variant, or instance in Figma** — including via the Figma Plugin API, MCP `use_figma`, bulk scripts, or “helpful” fixes — **unless the human owner has given an explicit, written instruction in that same task to change Figma components.**

If the instruction is ambiguous (e.g. “improve the design,” “sync tokens,” “use the MCP”) **without** clearly authorizing **component** changes in Figma, **treat that as not permission to touch components.** Ask first, or limit work to read-only operations.

## What counts as “changing components”

The following are **forbidden without explicit permission**:

- Modifying any **COMPONENT**, **COMPONENT_SET**, or **INSTANCE** node (including children inside those definitions).
- Combining, splitting, or converting components / variant sets.
- Adding or removing variants, properties, or default states.
- Rewiring variable bindings, text, layout, fills, strokes, or effects **on component definitions** or instances used as the source of truth.
- Replacing fonts, copy, or structure inside published or work-in-progress **library** components for this file.

## What is allowed without special permission

Unless the owner says otherwise, these are **read-only** and generally acceptable:

- **Inspecting** the file: metadata, screenshots, variable listings, `get_design_context`, `get_metadata`, `get_variable_defs`, read-only `use_figma` scripts that **return** data and **do not mutate** the document.
- **Search** / discovery (`search_design_system`, library listing) that does not write to the file.
- **Documentation, code, or token files in this repo** — as long as Figma canvas nodes are not modified.

## Explicit permission — required wording

Permission must be **unmistakable**, for example:

- “**You may edit the Figma components** in file X …”
- “**Apply these changes in Figma** to the `speech-bubble` component set …”

Phrases that **do not** alone grant component-edit rights:

- “Use the Figma MCP.”
- “Bring in / build / implement X in Figma.”
- “Align with our tokens.”

If the owner wants Figma component work, they must **spell out** that components may be edited or created in Figma.

## If component changes might help but were not requested

1. **Do not** change Figma components.
2. Describe what you *would* change in **markdown or chat only**, or offer a **spec / checklist** for the owner to apply manually.
3. Optionally suggest **Figma version history** if they need to undo prior edits.

## Why this exists

Component libraries are shared sources of truth. Silent or “helpful” API edits can break production files, downstream teams, and trust. **Default to zero Figma component mutations.**

---

**Summary:** *No Figma component changes unless the owner explicitly says you may edit Figma components in that task.*