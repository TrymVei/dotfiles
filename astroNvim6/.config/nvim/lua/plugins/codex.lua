return {
  "kkrampis/codex.nvim",
  lazy = true,
  init = function()
    local group = vim.api.nvim_create_augroup("codexInsertMode", { clear = true })

    vim.api.nvim_create_autocmd({ "BufEnter", "TermOpen" }, {
      group = group,
      callback = function(args)
        if vim.bo[args.buf].filetype ~= "codex" then return end
        local ok, illuminate = pcall(require, "illuminate")
        if ok then illuminate.pause_buf(args.buf) end
        vim.schedule(function()
          if vim.api.nvim_buf_is_valid(args.buf) and vim.bo[args.buf].filetype == "codex" then
            vim.cmd "startinsert"
          end
        end)
      end,
    })
  end,
  cmd = { "Codex", "CodexToggle" }, -- Optional: Load only on command execution
  keys = require "mapping.codex",
  opts = require "configs.codex",
}
