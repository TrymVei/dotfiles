return {
  vim.keymap.set("n", "<leader>gdo", "<cmd>DiffviewOpen<CR>", { desc = "Open Diffview" }),
  vim.keymap.set("n", "<leader>gdc", "<cmd>DiffviewClose<CR>", { desc = "Close Diffview" }),
  vim.keymap.set("n", "<leader>gdr", "<cmd>DiffviewRefresh<CR>", { desc = "Refresh Diffview" }),
  vim.keymap.set("n", "<leader>gdh", "<cmd>DiffviewFileHistory<CR>", { desc = "Refresh Diffview" }),
}
