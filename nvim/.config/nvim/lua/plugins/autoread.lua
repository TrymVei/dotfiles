return {
  "AstroNvim/astrocore",
  init = function()
    local group = vim.api.nvim_create_augroup("externalFileRefresh", { clear = true })

    vim.opt.autoread = true

    ---Refresh the current buffer when the file changes on disk.
    ---@param args { buf: integer }
    local function refreshBuffer(args)
      local bufnr = args.buf

      if vim.fn.mode() == "c" then return end
      if not vim.api.nvim_buf_is_valid(bufnr) then return end
      if vim.bo[bufnr].buftype ~= "" or vim.bo[bufnr].modified then return end
      if vim.api.nvim_buf_get_name(bufnr) == "" then return end

      vim.cmd "checktime"
    end

    vim.api.nvim_create_autocmd({ "FocusGained", "BufEnter", "CursorHold", "CursorHoldI", "TermClose", "TermLeave" }, {
      group = group,
      callback = refreshBuffer,
      desc = "Refresh file buffers when files change outside Neovim",
    })
  end,
  opts = function(_, opts)
    opts.mappings = opts.mappings or {}
    opts.mappings.n = opts.mappings.n or {}
    opts.mappings.n["<leader>ur"] = {
      "<cmd>checktime<cr>",
      desc = "Refresh buffer from disk",
    }
  end,
}
