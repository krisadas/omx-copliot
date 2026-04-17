# omx-copliot

OMX-CoPilot is a workflow layer for GitHub Copilot CLI.

It keeps Copilot CLI as the execution engine and makes it easier to:
- start stronger sessions by default
- run one consistent flow from clarification to completion
- invoke canonical workflows with `$deep-interview`, `$ralplan`, `$team`, and `$ralph`
- keep project guidance, plans, logs, and state in `.omx/`

## Reference And Attribution

This repository is a Copilot CLI-focused fork and adaptation of the original project:
- https://github.com/Yeachan-Heo/oh-my-codex.git

This README's product framing and usage model are authored for OMX Copilot usage, and are informed by these sources:
- OMX runtime contract and orchestration policy in [AGENTS.md](./AGENTS.md)
- OMX command surfaces and behavior in [src/cli/index.ts](./src/cli/index.ts)
- Existing OMX docs set in [docs/getting-started.html](./docs/getting-started.html) and [docs/skills.html](./docs/skills.html)
- Legacy website/docs sources (historical reference, may be outdated/unavailable):
  - https://yeachan-heo.github.io/oh-my-codex-website/
  - https://yeachan-heo.github.io/oh-my-codex-website/docs.html

This fork keeps compatibility paths such as `.codex/` and `CODEX_HOME` where required by runtime behavior, while adapting workflows for GitHub Copilot CLI.

### Legacy Team Listings (Historical Reference)

These listings are preserved as historical reference only.

## New Usage Guide

### 1) Clone And Install Dependencies (Source Only)

```bash
git clone https://github.com/krisadas/omx-copliot
cd omx-copliot
npm install
npm audit fix
npm run build
```

What this does:
- installs local dependencies
- builds `dist/` outputs from this source tree
- prepares runnable local CLI entrypoint at `dist/cli/omx.js`

### 2) Initialize Runtime Assets From Source Build

```bash
omxc setup
omxc doctor
```

Equivalent source-tree direct commands:

```bash
node dist/cli/omx.js setup
node dist/cli/omx.js doctor
```

### 3) Start A Session (From This Source Tree)

Default interactive session:

```bash
omxc
```

High reasoning + permissive approvals (trusted environments only):

```bash
omxc --high --madmax
```

Detached tmux leader session:

```bash
omxc --tmux --high --madmax
```

### 4) Use The Core Flow In Session

Use this sequence for most complex work:

```text
$deep-interview "clarify requirements and boundaries"
$ralplan "approve architecture, risks, and tests"
$ralph "execute end-to-end with verification"
```

When execution is parallelizable, switch to team mode:

```text
$team 3:executor "implement approved plan in parallel lanes"
```

### 5) Daily Command Patterns (Source Build)

Repository exploration:

```bash
omxc explore --prompt "find where worker launch args are normalized"
```

Bounded shell verification:

```bash
omxc sparkshell git status
omxc sparkshell --tmux-pane %12 --tail-lines 300
```

Team runtime operations:

```bash
omxc team 4:executor "fix build and failing tests"
omxc team status <team-name>
omxc team resume <team-name>
omxc team shutdown <team-name>
```

### 6) Runtime Model

Think of OMX in three layers:
- Copilot CLI runs the core agent execution
- OMX adds orchestration workflows and guardrails
- `.omx/` persists plans, state, logs, and runtime metadata

### 7) Environment Requirements

- Node.js 20+
- GitHub CoPilot CLI installed and authenticated in your environment
- `tmux` on macOS/Linux for team mode
- `psmux` on Windows for native team mode

### 8) Operational Tips

- Use `npm run setup` after upgrades to refresh managed assets
- Use `npm run doctor` first when something looks inconsistent
- Keep `AGENTS.md` in repo root for project-specific orchestration policy
- Prefer `$ralplan` before `$team`/`$ralph` for large or risky changes

### 9) Known Startup Issue (Intel Mac)

If startup causes high `syspolicyd` / `trustd` CPU on Intel Macs:
- run `xattr -dr com.apple.quarantine $(which omxc)` (if you also use a global install)
- add your terminal to Developer Tools in macOS security settings
- reduce launch aggressiveness (for example, skip `--madmax --high`)

## Local Project References

- [AGENTS contract](./AGENTS.md)
- [CLI implementation](./src/cli/index.ts)
- [Template AGENTS](./templates/AGENTS.md)
- [Contributing](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

## Languages

- [English](./README.md)

## Contributors

| Role | Name | GitHub |
| --- | --- | --- |
| Fork Owner & Maintainer | Krisada | [@krisadas](https://github.com/krisadas) |

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Yeachan-Heo/oh-my-codex&type=date&legend=top-left)](https://www.star-history.com/#Yeachan-Heo/oh-my-codex&type=date&legend=top-left)

## License

MIT
