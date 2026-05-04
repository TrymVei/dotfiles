# dotfiles

Personal dotfiles for zsh, starship, tmux, ghostty, Claude Code, and Codex.

## Contents

- **`.zshrc`** - Zsh shell configuration with Oh My Zsh, plugins, and aliases
- **`.config/starship.toml`** - Starship prompt configuration
- **`.config/ghostty/config`** - Ghostty terminal configuration
- **`.tmux.conf`** - Tmux configuration
- **`.claude/settings.json`** - Claude Code settings
- **`.config/nvim`** - Neovim configuration
- **`.config/sharedAgents`** - Shared agent instructions and skills consumed by both Claude and Codex

## Features

### Shell Setup
- Oh My Zsh with `git` and `zsh-autosuggestions` plugins
- Starship prompt for a fast and customizable command prompt
  <img width="660" height="130" alt="image" src="https://github.com/user-attachments/assets/be14add1-262f-4646-8f24-3cda2843f5c3" />


### Tool Aliases & Functions
- **Git**: `gcom` - checkout main and pull
- **Neovim**: `v`, `vz`, `vc`, `vk`, `va`, `vl` - quick launch different Nvim configs
- **Lazygit**: `lg` - launch lazygit
- **Yazi**: `y()` - file manager with directory navigation

### Version Managers
- NVM (Node Version Manager)

### Shared Agent Config
- `sharedAgents/.config/sharedAgents` is the canonical source for shared `AGENTS.md` instructions and reusable skills
- `codex/.config/codex/AGENTS.MD` and selected skill directories are symlinked to the shared source
- `claude/.claude/AGENTS.md` and selected skill directories are symlinked to the same shared source

## Quick Setup on a New Machine

### Recommended Structure

Keep the repo portable and split config into these buckets:

- **Base config in repo**: shared defaults that should work on every machine
- **Local overrides outside stow**: machine-specific paths, work-only tools, and temporary integrations
- **App-local state outside repo**: trust settings, logs, caches, plugin installs, and other generated files

Examples from this repo:

- `zsh/.zshrc` should stay portable and now loads `~/.zshrc.local` if it exists
- `~/.zshrc.local` should contain things like Rancher Desktop paths, Google Cloud SDK setup, or other machine-only PATH changes
- `codex/.config/codex/config.toml` should ideally only contain shared defaults; project trust entries with absolute paths are better kept local
- `sharedAgents/.config/sharedAgents/AGENTS.md` should use home-relative paths in examples and instructions

### Prerequisites

#### macOS
```bash
# CLI tools: required
brew install stow starship nvm lazygit yazi tmux neovim
brew install --cask ghostty font-fantasque-sans-mono-nerd-font

# CLI tools: recommended
brew install fzf fd ripgrep zoxide gh jq yq

# CLI tools: optional
brew install pnpm yarn deno podman
brew install --cask claude-code codex

# GUI apps I also use on macOS
brew install --cask betterdisplay obsidian raycast arc
# Install Superpowered separately if needed

# Bun
brew install oven-sh/bun/bun

# Oh My Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Zsh plugins
git clone https://github.com/zsh-users/zsh-autosuggestions \
  ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
```

#### Linux (Arch/CachyOS)
```bash
# Pacman packages
sudo pacman -S stow starship nvm lazygit yazi zsh tmux ghostty neovim

# Nerd Font for Ghostty
sudo pacman -S ttf-fantasque-nerd

# Oh My Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Zsh plugins
git clone https://github.com/zsh-users/zsh-autosuggestions \
  ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
```

### Installation

Clone the repository to your home directory and run stow:
```bash
git clone https://github.com/TrymVei/dotfiles.git ~/dotfiles && cd ~/dotfiles && stow */
```

That's it! Your shell will be configured on the next reload.

If you need machine-specific shell setup, create `~/.zshrc.local` from `zsh/.zshrc.local.example`.

### Verify Setup
```bash
echo $ZSH_THEME  # Should be empty (using Starship)
zsh               # Reload shell
```

## Customization

- Edit `zsh/.zshrc` for shell configurations and aliases
- Edit `starship/.config/starship.toml` for prompt appearance
- Edit `ghostty/.config/ghostty/config` for terminal settings
- Edit `tmux/.tmux.conf` for tmux settings
- Edit `claude/.claude/settings.json` for Claude Code settings
- Edit `sharedAgents/.config/sharedAgents/AGENTS.md` and `sharedAgents/.config/sharedAgents/skills` for shared agent behavior
- Edit `nvim/.config/nvim` for Neovim settings

Changes in `~/dotfiles` will automatically reflect thanks to symlinks.

## Notes

- The configuration uses Starship as the primary prompt (theme in `.zshrc` is empty)
- Put machine-specific shell paths in `~/.zshrc.local`, not in `zsh/.zshrc`
- NVM is referenced directly in `.zshrc`
- Codex project trust entries are machine-specific and should not be treated as portable defaults
- Optional CLI tools in the macOS setup section are included for the broader workflow, not as hard requirements
- I also use Superpowered, BetterDisplay, Obsidian, Raycast, and Arc on macOS
