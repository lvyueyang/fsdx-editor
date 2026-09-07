---
name: deploy
description: 检测 @easyx/editor 与 @easyx/tiptap-table-plus 两个包是否有变动及变动范围，据此升级 package.json 版本号。发布流程：检测 → 判定范围 → 升级版本。
---

# 发布前置：检测包变动并升级版本号

执行本命令前，先确认工作区在 `main` 分支、本地已提交全部改动且**尚未推送**（本命令以 `origin/main` 为比对基线，须在推送前运行；推送后 `origin/main..HEAD` 为空，将无法检测改动）。

## 目标

判断两个包是否有变动，以及变动属于哪个范围（major / minor / patch），然后按范围升级对应 `package.json` 的版本号。

- `@easyx/editor` → `packages/editor`
- `@easyx/tiptap-table-plus` → `packages/tiptap-table-plus`

## 步骤

### 1. 检测包是否有变动

对每个包，先对比 npm 已发布版本与本地版本：

```bash
pnpm view @easyx/editor version
pnpm view @easyx/tiptap-table-plus version
node -p "require('./packages/editor/package.json').version"
node -p "require('./packages/tiptap-table-plus/package.json').version"
```

- 若本地版本 == 已发布版本：该包可能有未发布改动，需结合 git 判定（见下）。
- 若本地版本 > 已发布版本：该包版本已升级，但若存在 src 变更仍需进入步骤 2 复核范围。
- 若本地版本 < 已发布版本：异常，停下核对。

进入步骤 2 的唯一条件：**本地版本 == 已发布版本 或 本地版本 > 已发布版本，且自上次发布以来该包存在 src 变更**。

未发布改动的判定依据（包目录范围统一以 `src` 为计，`tests/` 与 `package.json` 依赖声明变更不计入产物变动，仅作参考）：

```bash
git log origin/main..HEAD --oneline -- packages/<包目录>/src
git diff origin/main..HEAD --stat -- packages/<包目录>/src
```

若两包均无 src 变更，直接输出「无需升级版本」。

### 2. 判定变动范围

读取该包自上次发布（相对 `origin/main`）以来的 commit 信息（含正文，用于识别 body 中的 `BREAKING CHANGE:` footer）：

```bash
git log origin/main..HEAD --format='%s%n%b' -- packages/<包目录>/src
```

按 Conventional Commits 判定范围（从高到低，命中即取该档）：

| 判定条件 | 范围 |
|---------|------|
| 提交信息含 `!` 后缀（如 `feat!:`、`refactor!:`）或 `BREAKING CHANGE` | **major** |
| 含 `feat(` / `feat:` 或 `feat!` | **minor** |
| 其余功能/修复改动（`fix`、`refactor`、`perf`、`style` 等） | **patch** |
| 仅 `docs` / `ci` / `chore` / 纯配置文件改动，不影响产物 | 可视为无变动，跳过 |

跨包依赖说明：`@easyx/editor` 依赖 `@easyx/tiptap-table-plus`（`workspace:*`）。若只有 tiptap-table-plus 有实际变更，仅 bump tiptap-table-plus；若 editor 自身 src 也有变更，则两包分别独立 bump。

### 3. 升级版本号

按步骤 2 判定的范围对对应包执行：

```bash
# 注意：`pnpm --filter <pkg> version` 会把 `version` 当作包内脚本解析，必须用 `exec pnpm version` 调用内置命令
pnpm --filter @easyx/editor exec pnpm version major|minor|patch --no-git-tag-version
pnpm --filter @easyx/tiptap-table-plus exec pnpm version major|minor|patch --no-git-tag-version
```

`--no-git-tag-version` 不生成 git tag，版本号只写入 `package.json`，由用户手动提交。

### 4. 校验

- 再次读取两包 `package.json` 的 `version`，确认已按预期递增。
- 若同时升级了两个包，确认 editor 依赖的 `@easyx/tiptap-table-plus` 保持 `workspace:*`（发布流程会自动改写为实际版本）。
- 运行 `pnpm check` 确保规范检查通过。

## 输出

汇总报告，包含每个包：是否有变动、判定范围、原版本 → 新版本、依据的 commit 列表。
