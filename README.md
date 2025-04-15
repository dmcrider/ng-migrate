# 🛠 ng-migrate

A CLI tool to automate and simplify upgrading Angular projects from version **12 to 18**, including codemods for breaking changes, modernization, and best practices.

---

## 🚀 Features

- 🔎 Auto-detect current Angular version
- 🎯 Incremental upgrades to a target version (e.g. `--to=18`)
- 🧪 Dry-run and step-by-step confirmation modes
- 🛠 Codemods for:
  - Breaking changes (Renderer → Renderer2, deprecated APIs)
  - ViewEngine removal
  - Typed reactive forms
  - Standalone component conversion
- 🗂 Structured reports for migration candidates
- ✅ Git snapshot support for each upgrade step

---

## 📦 Installation

```bash
npm install
```

---

## 🧪 Example Usage

### Upgrade from Angular 12 to 18

```bash
npx ts-node bin/ng-migrate.ts migrate --to=18
```

### Confirm each step with dry-run previews

```bash
npx ts-node bin/ng-migrate.ts migrate --to=18 --confirm-each-step
```

### Auto-confirm steps and create Git snapshots

```bash
npx ts-node bin/ng-migrate.ts migrate --to=18 -y -snapshot
```

### Dry-run mode (simulate without writing)

```bash
npx ts-node bin/ng-migrate.ts migrate --to=18 -d
```

### Run codemods only (no Angular CLI updates)

```bash
npx ts-node bin/ng-migrate.ts migrate --to=16 --codemods-only
```

---

## 🧰 Flags

| Flag                    | Alias     | Description                                       |
|-------------------------|-----------|---------------------------------------------------|
| `--to=<version>`        |           | 🔹 Target Angular version (required)              |
| `--confirm-each-step`   | `-confirm`| Show dry-run + confirm before applying each step |
| `--yes`                 | `-y`      | Auto-confirm all prompts                          |
| `--dry-run`             | `-d`      | Skip actual `ng update` and codemod file writes   |
| `--verbose`             | `-v`      | Show full stdout/stderr for each command          |
| `--create-git-snapshots`| `-snapshot`| Commit project before each upgrade step          |
| `--codemods-only`       |           | Only run codemods — skip Angular CLI upgrades     |
| `--help`                | `-h`      | Show CLI usage information                        |

---

## 🧐 Codemod Phases

### 🔹 Phase 1: Breaking Fixes & Cleanup (12 → 14)
- Replace `Renderer` with `Renderer2`
- Remove ViewEngine config
- Flag `APP_INITIALIZER`
- Add generic types to `FormControl`, `FormGroup`, etc.

### 🔹 Phase 2: Structural Upgrades (15 → 17)
- Detect `NgModules` and generate migration reports
- Convert eligible components to `standalone: true`
- Prepare for `bootstrapApplication()`

### 🔹 Phase 3 (Planned)
- Replace `bootstrapModule` with `bootstrapApplication`
- Detect signals and `DestroyRef` usage
- Advanced template refactors (defer blocks, etc.)

---

## 🗂 Reports

- `codemods/ngmodule-usage.json`  
  Generated automatically to record all detected `NgModules`, their contents, and standalone migration candidates.

---

## 📋 Requirements

- Node 18+
- TypeScript project with `tsconfig.json` at root
- Git (for snapshot support)

---

## 💠 Development Notes

This project uses:
- `ts-morph` for codemods
- `chalk`, `inquirer` for CLI interactivity
- Modular command structure under `src/commands/` and `src/codemods/`

---

## 💪 Roadmap

- [x] Phase 1 codemods
- [x] Phase 2 detection and safe conversion
- [ ] Phase 2 bootstrap conversion
- [ ] Phase 3 modernization (Signals, defer blocks, DestroyRef)
- [ ] `.ng-migraterc.json` config support
- [ ] HTML template analysis

---

## 🛋️ Contributing

Pull requests welcome — codemods should follow the `Codemod` interface in `src/codemods/types.ts`.

---

## 🧙‍♂️ License

MIT – Use at your own risk. Backup your project before applying codemods or upgrades.