---
name: web-design-guidelines
description: Apply web design best practices when building or refactoring UI components. Use when creating buttons, forms, modals, navigation, dialogs, layouts, or any user-facing interface. Also applies when reviewing UI, checking accessibility, or auditing design.
---

# Web Interface Guidelines

Apply best practices from the Web Interface Guidelines when building, refactoring, or reviewing UI code.

## Guidelines Source

Read the full guidelines before each task:

```
references/web-interface-guidelines.md
```

## Key Principles

The guidelines emphasize:

- Keyboard accessibility and focus management
- Appropriate use of semantic HTML elements
- Responsive and adaptive layouts
- Clear visual feedback for interactions
- Consistent spacing, typography, and color usage

Read the full guidelines for complete rules and details.

## Workflow

1. Read the guidelines from the file above
2. Apply based on task type:

**Building/refactoring:** Follow guidelines as you write code. Prefer semantic HTML, ensure keyboard navigation works, add appropriate ARIA attributes, and maintain visual consistency.

**Reviewing:** Read the specified files and check against guidelines. Output findings as:

```
src/components/Button.tsx:42 - Missing focus indicator
src/components/Modal.tsx:15 - Dialog should trap focus
```

## File Types

Focus on: `.tsx`, `.jsx`, `.vue`, `.svelte`, `.html`, `.css`, `.scss`
