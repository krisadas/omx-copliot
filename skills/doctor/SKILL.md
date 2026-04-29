---
name: doctor
description: Diagnose and fix omx-copilot installation issues
---

# Doctor Skill

Note: All `~/.copilot/...` paths in this guide respect `COPILOT_HOME` when that environment variable is set.

## Task: Run Installation Diagnostics

You are the OMX Doctor - diagnose and fix installation issues.

### Step 1: Check Plugin Version

```bash
# Get installed version
INSTALLED=$(ls ~/.copilot/plugins/cache/omc/omx-copilot/ 2>/dev/null | sort -V | tail -1)
echo "Installed: $INSTALLED"

# Get latest from npm
LATEST=$(npm view omx-copilot version 2>/dev/null)
echo "Latest: $LATEST"
```

**Diagnosis**:
- If no version installed: CRITICAL - plugin not installed
- If INSTALLED != LATEST: WARN - outdated plugin
- If multiple versions exist: WARN - stale cache

### Step 2: Check Hook Configuration (config.toml + legacy settings.json)

Check `~/.copilot/config.toml` first (current Codex config), then check legacy `~/.copilot/settings.json` only if it exists.

Look for hook entries pointing to removed scripts like:
- `bash $HOME/.copilot/hooks/keyword-detector.sh`
- `bash $HOME/.copilot/hooks/persistent-mode.sh`
- `bash $HOME/.copilot/hooks/session-start.sh`

**Diagnosis**:
- If found: CRITICAL - legacy hooks causing duplicates

### Step 3: Check for Legacy Bash Hook Scripts

```bash
ls -la ~/.copilot/hooks/*.sh 2>/dev/null
```

**Diagnosis**:
- If `keyword-detector.sh`, `persistent-mode.sh`, `session-start.sh`, or `stop-continuation.sh` exist: WARN - legacy scripts (can cause confusion)

### Step 4: Check AGENTS.md

```bash
# Check if AGENTS.md exists
ls -la ~/.copilot/AGENTS.md 2>/dev/null

# Check for OMX marker
grep -q "omx-copilot Multi-Agent System" ~/.copilot/AGENTS.md 2>/dev/null && echo "Has OMX config" || echo "Missing OMX config"
```

**Diagnosis**:
- If missing: CRITICAL - AGENTS.md not configured
- If missing OMX marker: WARN - outdated AGENTS.md

### Step 5: Check for Stale Plugin Cache

```bash
# Count versions in cache
ls ~/.copilot/plugins/cache/omc/omx-copilot/ 2>/dev/null | wc -l
```

**Diagnosis**:
- If > 1 version: WARN - multiple cached versions (cleanup recommended)

### Step 6: Check for Legacy Curl-Installed Content

Check for legacy agents, commands, and historical legacy skill roots from older installs/migrations:

```bash
# Check for legacy agents directory
ls -la ~/.copilot/agents/ 2>/dev/null

# Check for legacy commands directory
ls -la ~/.copilot/commands/ 2>/dev/null

# Check canonical current skills directory
ls -la ${COPILOT_HOME:-~/.copilot}/skills/ 2>/dev/null

# Check historical legacy skill directory
ls -la ~/.agents/skills/ 2>/dev/null
```

**Diagnosis**:
- If `~/.copilot/agents/` exists with omx-copilot-related files: WARN - legacy agents (now provided by plugin)
- If `~/.copilot/commands/` exists with omx-copilot-related files: WARN - legacy commands (now provided by plugin)
- If `${COPILOT_HOME:-~/.copilot}/skills/` exists with OMX skills: OK - canonical current user skill root
- If `~/.agents/skills/` exists: WARN - historical legacy skill root that can overlap with `${COPILOT_HOME:-~/.copilot}/skills/` and cause duplicate Enable/Disable Skills entries

Look for files like:
- `architect.md`, `researcher.md`, `explore.md`, `executor.md`, etc. in agents/
- `ultrawork.md`, `deepsearch.md`, etc. in commands/
- Any omx-copilot-related `.md` files in skills/

---

## Report Format

After running all checks, output a report:

```
## OMX Doctor Report

### Summary
[HEALTHY / ISSUES FOUND]

### Checks

| Check | Status | Details |
|-------|--------|---------|
| Plugin Version | OK/WARN/CRITICAL | ... |
| Hook Config (config.toml / legacy settings.json) | OK/CRITICAL | ... |
| Legacy Scripts (~/.copilot/hooks/) | OK/WARN | ... |
| AGENTS.md | OK/WARN/CRITICAL | ... |
| Plugin Cache | OK/WARN | ... |
| Legacy Agents (~/.copilot/agents/) | OK/WARN | ... |
| Legacy Commands (~/.copilot/commands/) | OK/WARN | ... |
| Skills (${COPILOT_HOME:-~/.copilot}/skills) | OK/WARN | ... |
| Legacy Skill Root (~/.agents/skills) | OK/WARN | ... |

### Issues Found
1. [Issue description]
2. [Issue description]

### Recommended Fixes
[List fixes based on issues]
```

---

## Auto-Fix (if user confirms)

If issues found, ask user: "Would you like me to fix these issues automatically?"

If yes, apply fixes:

### Fix: Legacy Hooks in legacy settings.json
If `~/.copilot/settings.json` exists, remove the legacy `"hooks"` section (keep other settings intact).

### Fix: Legacy Bash Scripts
```bash
rm -f ~/.copilot/hooks/keyword-detector.sh
rm -f ~/.copilot/hooks/persistent-mode.sh
rm -f ~/.copilot/hooks/session-start.sh
rm -f ~/.copilot/hooks/stop-continuation.sh
```

### Fix: Outdated Plugin
```bash
rm -rf ~/.copilot/plugins/cache/omc/omx-copilot
echo "Plugin cache cleared. Restart Codex CLI to fetch latest version."
```

### Fix: Stale Cache (multiple versions)
```bash
# Keep only latest version
cd ~/.copilot/plugins/cache/omc/omx-copilot/
ls | sort -V | head -n -1 | xargs rm -rf
```

### Fix: Missing/Outdated AGENTS.md
Fetch latest from GitHub and write to `~/.copilot/AGENTS.md`:
```
WebFetch(url: "https://raw.githubusercontent.com/Yeachan-Heo/omx-copilot/main/docs/AGENTS.md", prompt: "Return the complete raw markdown content exactly as-is")
```

### Fix: Legacy Curl-Installed Content

Remove legacy agents/commands plus the historical `~/.agents/skills` tree if it overlaps with the canonical `${COPILOT_HOME:-~/.copilot}/skills` install:

```bash
# Backup first (optional - ask user)
# mv ~/.copilot/agents ~/.copilot/agents.bak
# mv ~/.copilot/commands ~/.copilot/commands.bak
# mv ~/.agents/skills ~/.agents/skills.bak

# Or remove directly
rm -rf ~/.copilot/agents
rm -rf ~/.copilot/commands
rm -rf ~/.agents/skills
```

**Note**: Only remove if these contain omx-copilot-related files. If user has custom agents/commands/skills, warn them and ask before removing.

---

## Post-Fix

After applying fixes, inform user:
> Fixes applied. **Restart Codex CLI** for changes to take effect.
