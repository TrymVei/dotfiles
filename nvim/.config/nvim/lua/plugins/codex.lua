return {
  "kkrampis/codex.nvim",
  lazy = true,
  init = function()
    local group = vim.api.nvim_create_augroup("codexInsertMode", { clear = true })

    vim.api.nvim_create_autocmd({ "BufEnter", "TermOpen" }, {
      group = group,
      callback = function(args)
        if vim.bo[args.buf].filetype ~= "codex" then return end
        vim.cmd "startinsert"
      end,
    })
  end,
  cmd = { "Codex", "CodexToggle" }, -- Optional: Load only on command execution
  keys = require "mapping.codex",
  opts = require "configs.codex",
}
