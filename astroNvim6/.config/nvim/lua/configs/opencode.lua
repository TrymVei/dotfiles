---@type opencode.Opts
vim.g.opencode_opts = {
  provider = {
    enabled = "snacks",
    snacks = {
      auto_close = false,
      win = {
        position = "right",
        width = 0.35,
        fixbuf = false,
        bo = {
          filetype = "opencode_terminal",
        },
      },
    },
  },
}

-- Required for `opts.events.reload`.
vim.o.autoread = true

-- Marker hovedvinduet slik at snacks vet hvor filer skal åpnes
vim.api.nvim_create_autocmd("BufEnter", {
  callback = function()
    local win = vim.api.nvim_get_current_win()
    local buf = vim.api.nvim_get_current_buf()
    -- Marker vinduet som "main" hvis det er en vanlig fil-buffer
    if vim.bo[buf].buftype == "" and not vim.api.nvim_win_get_config(win).zindex then
      vim.w[win].snacks_main = true
    end
  end,
})
