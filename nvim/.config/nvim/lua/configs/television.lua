local h = require("tv").handlers

require("tv").setup {
  global_keybindings = require "mapping.television",
  -- global window appearance (can be overridden per channel)
  window = {
    width = 1.0,
    height = 1.0,
    border = "none",
    title = " tv.nvim ",
    title_pos = "center",
  },
  -- per-channel configurations
  channels = {
    -- `files`: fuzzy find files in your project
    files = {
      handlers = {
        ["<CR>"] = h.open_as_files, -- default: open selected files
        ["<C-q>"] = h.send_to_quickfix, -- send to quickfix list
        ["<C-s>"] = h.open_in_split, -- open in horizontal split
        ["<C-v>"] = h.open_in_vsplit, -- open in vertical split
        ["<C-y>"] = h.copy_to_clipboard, -- copy paths to clipboard
      },
    },

    -- `text`: ripgrep search through file contents
    text = {
      handlers = {
        ["<CR>"] = h.open_at_line, -- Jump to line:col in file
        ["<C-q>"] = h.send_to_quickfix, -- Send matches to quickfix
        ["<C-s>"] = h.open_in_split, -- Open in horizontal split
        ["<C-v>"] = h.open_in_vsplit, -- Open in vertical split
        ["<C-y>"] = h.copy_to_clipboard, -- Copy matches to clipboard
      },
    },

    -- `git-log`: browse commit history
    ["git-log"] = {
      handlers = {
        -- custom handler: show commit diff in scratch buffer
        ["<CR>"] = function(entries, config)
          if #entries > 0 then
            vim.cmd "enew | setlocal buftype=nofile bufhidden=wipe"
            vim.cmd("silent 0read !git show " .. vim.fn.shellescape(entries[1]))
            vim.cmd "1delete _ | setlocal filetype=git nomodifiable"
            vim.cmd "normal! gg"
          end
        end,
        -- copy commit hash to clipboard
        ["<C-y>"] = h.copy_to_clipboard,
      },
    },

    -- `git-branch`: browse git branches
    ["git-branch"] = {
      handlers = {
        -- checkout branch using execute_shell_command helper
        -- {} is replaced with the selected entry
        ["<CR>"] = h.execute_shell_command "git checkout {}",
        ["<C-y>"] = h.copy_to_clipboard,
      },
    },

    -- `docker-images`: browse images and run containers
    ["docker-images"] = {
      window = { title = " Docker Images " },
      handlers = {
        -- run a container with the selected image
        ["<CR>"] = function(entries, config)
          if #entries > 0 then
            vim.ui.input({
              prompt = "Container name: ",
              default = "my-container",
            }, function(name)
              if name and name ~= "" then
                local cmd = string.format("docker run -it --name %s %s", name, entries[1])
                vim.cmd("!" .. cmd)
              end
            end)
          end
        end,
        -- copy image name
        ["<C-y>"] = h.copy_to_clipboard,
      },
    },

    -- `env`: search environment variables
    env = {
      handlers = {
        ["<CR>"] = h.insert_at_cursor, -- Insert at cursor position
        ["<C-l>"] = h.insert_on_new_line, -- Insert on new line
        ["<C-y>"] = h.copy_to_clipboard,
      },
    },

    -- `aliases`: search shell aliases
    alias = {
      handlers = {
        ["<CR>"] = h.insert_at_cursor,
        ["<C-y>"] = h.copy_to_clipboard,
      },
    },
  },
  -- path to the tv binary (default: 'tv')
  tv_binary = "tv",
  quickfix = {
    auto_open = true, -- automatically open quickfix window after populating
  },
}
