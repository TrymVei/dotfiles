return {
  vim.keymap.set("n", "<leader>app", ":PiSend<CR>", { desc = "Pi send" }),
  vim.keymap.set("n", "<leader>apf", ":PiSendFile<CR>", { desc = "Pi send file" }),
  vim.keymap.set("v", "<leader>aps", ":PiSendSelection<CR>", { desc = "Pi send selection" }),
  vim.keymap.set("n", "<leader>apb", ":PiSendBuffer<CR>", { desc = "Pi send buffer" }),
  vim.keymap.set("n", "<leader>api", ":PiPing<CR>", { desc = "Pi ping" }),
}
