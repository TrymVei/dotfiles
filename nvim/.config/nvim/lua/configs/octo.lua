require("octo").setup {
  enable_builtin = true,
  default_remote = { "upstream", "origin" },
  picker = "snacks",
  picker_config = {
    use_emojis = true,
  },
  suppress_missing_scope = {
    projects_v2 = true,
  },
}

-- Clean up fold display in Octo diff buffers
vim.api.nvim_create_autocmd("BufEnter", {
  pattern = "octo://*",
  callback = function()
    vim.opt_local.foldtext = ""
  end,
})
