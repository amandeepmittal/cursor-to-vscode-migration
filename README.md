![Claude Code Skill](https://img.shields.io/badge/Claude_Code-Skill-orange?logo=claude&logoColor=white)

# Cursor to VS Code Migration Skill

A Claude Code plugin that automates migrating your editor setup from Cursor to VS Code. It cleans old VS Code data, copies settings/keybindings, strips Cursor-specific config keys, and installs all your extensions fresh from the VS Code marketplace.

Works on macOS and Linux.

## What it does

- Detects your Cursor settings and extensions
- Cleans stale VS Code extensions, settings, and caches
- Copies `settings.json`, `keybindings.json`, and snippets from Cursor
- Removes Cursor-specific keys (`cursor.*`, `aicursor.*`, `anysphere.*`) from settings
- Installs extensions fresh, skipping Cursor-only ones (`anysphere.*`, `openai.chatgpt`)
- Confirms before doing anything destructive

## Installation

### As a plugin (recommended)

Add the marketplace and install via Claude Code:

```
/plugin marketplace add amandeepmittal/cursor-to-vscode-migration
/plugin install cursor-to-vscode-migration
```

### Manual

Clone directly into your skills directory:

```shell
git clone https://github.com/amandeepmittal/cursor-to-vscode-migration.git \
  ~/.claude/skills/cursor-to-vscode-migration
```

## Usage

Restart Claude Code after installing, then close VS Code and tell Claude Code:

```
migrate my setup from cursor to vscode
```

Claude Code will auto-detect and invoke the skill based on your request. The skill walks through each step, asking for confirmation before cleaning or overwriting anything.

## Plugin structure

```
cursor-to-vscode-migration/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   └── cursor-to-vscode-migration/
│       ├── SKILL.md
│       └── scripts/
│           ├── clean_vscode_caches.sh
│           ├── list_cursor_extensions.cjs
│           └── strip_cursor_keys.cjs
├── LICENSE
└── README.md
```

## License

MIT
