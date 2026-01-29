# Development Rules — Memory Bank

Este documento é o "memory bank" de regras de desenvolvimento do projeto usado por desenvolvedores humanos e por agentes/IA que colaboram no repositório.

Checklist rápido (o que este arquivo cobre):
- Padrões de nomenclatura e convenções (classes, métodos, variáveis em inglês)
- Regras para labels/textos em front-end (português permitido)
- Estrutura de pastas e responsabilidades dos diretórios principais
- Boas práticas (TypeScript, SDUI, componentes, testes)
- Regras para commits, PRs e revisão de código
- Diretrizes específicas para a IA (como gerar/editar código seguindo as regras)
- Exemplos curtos (bons e ruins) e checagens rápidas

Resumo de regras primárias
- All identifiers (classes, functions, methods, variables, types, interfaces) MUST be in English.
- Front-end user-facing labels and copy (button text, screen titles, form labels) MAY be in Portuguese.
- Use TypeScript strict mode and prefer explicit typing for public interfaces.

Naming conventions (must)
- Components: PascalCase (e.g. `PoliticianCard`, `ScreenRenderer`). File names for components: `PoliticianCard.tsx` (match default export).
- React component props interfaces: `ComponentNameProps` (e.g. `PoliticianCardProps`).
- Functions and methods: camelCase (e.g. `fetchPoliticians`, `renderHeader`).
- Variables and constants: camelCase. For exported constants, use UPPER_SNAKE only for true constants (e.g. `API_TIMEOUT_MS`).
- Types and interfaces: PascalCase (e.g. `Politician`, `SDUIScreen`).
- Enums: PascalCase (e.g. `UserRole`) and enum members in PascalCase.
- Files: PascalCase for components and screens, kebab-case or camelCase for utilities (follow existing repo pattern; prefer camelCase for utils in this codebase).
- Tests: match file under test with `.spec.tsx` or `.spec.ts` suffix (e.g. `PoliticianCard.spec.tsx`).

Language rules
- All source-level identifiers: English only. This ensures consistency across the codebase and for AI tooling.
- Comments and commit messages: English preferred, Portuguese allowed when describing UX copy or policy that is inherently Portuguese.
- UI copy (labels, placeholders, messages visible to users): can be in Portuguese. Keep translation keys in English (e.g. `button.follow` -> "Seguir").

TypeScript and typing
- `tsconfig.json` must have `"strict": true`.
- Avoid `any`. If a type cannot be precisely inferred, create a named type or interface and add a short comment explaining the shape.
- Use discriminated unions for SDUI element types when applicable.
- Export types from `src/types/*` and prefer imports via aliases (e.g. `@/types/sdui`).

SDUI specific
- Each SDUI component must have a dedicated props interface in `src/types/sdui.ts` or a closely related file and be registered in `src/sdui/ComponentRegistry.tsx`.
- Registry keys MUST be lowercase-hyphen identifiers matching server contract (e.g. `text-block`, `politician-card`). Component display names remain PascalCase in code.
- SDUI components should be pure/presentational. Side effects (data fetching, navigation) must be lifted to container components or to action handlers in `src/sdui/SDUIActionsContext.tsx`.
- Validate incoming SDUI payloads with runtime guards before rendering. Prefer small runtime validators (type guards) over `any`.

Components and styling
- Prefer composition over inheritance. Small focused components are preferred.
- Keep components small: < 200 LOC when possible. If larger, split into subcomponents.
- Styling: prefer a theme/variants system in `src/constants.ts` and centralize spacing, colors, and typography. Use style objects over inline magic numbers.
- Accessibility: always set accessibilityLabel for interactive elements and provide alt text for images when possible.

State and side-effects
- Prefer React Context or hooks for global/shared state. Keep complex logic in `src/services/*`.
- Side-effects (fetching, storage) should be in `src/services` with small, testable functions.

Tests
- Unit tests for components and utilities (Jest + React Testing Library preferred).
- One integration test for important SDUI render flows.
- Coverage: aim at >= 70% for critical modules; prioritize meaningful tests over noise.

Linting and formatting
- ESLint + Prettier configured. Fix lint warnings before merging PRs.
- Disable rules only when strictly necessary and add an inline comment explaining why.

Git workflow
- Branches: `feature/<short-descr>`, `fix/<short-descr>`, `hotfix/<short-descr>`, `chore/<short-descr>`.
- Commits: use Conventional Commits format (e.g. `feat: add politician card component`).
- PRs: include summary, screenshots (if UI), changelog line, and testing instructions.
- Code reviews: at least one approving review required for non-trivial changes.

CI / Pre-merge checks
- All PRs must pass: lint, type-check, unit tests. Add scripts to `package.json` if missing: `lint`, `typecheck`, `test`.

Release/versioning
- Semantic versioning. Use `CHANGELOG.md` and release notes.

Security
- Don't commit secrets. Use environment variables and `secure-storage` for secrets in runtime.
- Validate and sanitize any HTML or rich text coming from SDUI backend before injecting into the UI.

Examples — Good vs Bad
- Component name (good): `PoliticianCard.tsx` (component `PoliticianCard`, props `PoliticianCardProps`).
- Component name (bad): `cartaoDeputado.tsx` or `politician_card.tsx`.

- Function (good): `fetchPoliticianExpenses(politicianId: string): Promise<Expense[]>`.
- Function (bad): `buscarGastosDeputado(id)`, or `get_gastos(id)`.

AI / Bot interaction rules (important)
These rules tell any AI or automated agent how to propose or apply changes safely.
1. Follow naming and typing rules: any new identifiers must be English and follow the naming conventions above.
2. Keep UI labels untouched in Portuguese unless the change is explicitly about translations or copy. If changing copy, include both the English translation key and the Portuguese text.
   - Example: `i18nKeys.button.follow = "Seguir"` (key in English).
3. Small edits only: prefer non-invasive changes. For larger refactors, open a draft PR and include a migration plan.
4. Tests and type-checks: any automated code change must include updated unit tests and pass `typecheck` before merge.
5. Files touched: prefer changing as few files as possible. When adding files, place them under existing logical directories.
6. Runtime safety: when modifying SDUI rendering paths, ensure payload validation and error fallback UI are present.
7. Commit and PR metadata: AI must create descriptive commit messages following Conventional Commits and a PR description with the list of files changed and rationale.
8. If the AI is unsure about an ambiguous requirement (naming, UX copy, API contract), it should rise the issue as a comment in the PR instead of guessing.

Developer checklist before merging PR
- [ ] Lint and format passed
- [ ] Type-check passed
- [ ] Unit tests passed
- [ ] Integration/SMOKE flows tested locally
- [ ] Accessibility quick checks (labels, contrast)
- [ ] PR description includes testing steps and any migration notes

Quick reference rules
- Identifiers: English only
- Labels: Portuguese OK
- Components: PascalCase
- Functions/vars: camelCase
- Types/interfaces: PascalCase with suffix when helpful
- Tests: `.spec.tsx` / `.spec.ts`

Where to add new rules
- Add project-wide decisions to `docs/memory-bank.md` and cross-link to `docs/development-rules.md` for operational rules.

Contact / escalation
- If in doubt, open an issue marking `question` and assign a tech lead.

---

Document history
- v1.0 — Base rules created (date)

Search keywords: naming conventions, SDUI, TypeScript rules, AI guidelines, commit rules
