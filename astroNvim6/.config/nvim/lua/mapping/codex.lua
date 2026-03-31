return {
  {
    "<leader>ss", -- Change this to your preferred keybinding
    function() require("codex").toggle() end,
    desc = "Toggle Codex popup or side-panel",
    mode = { "n", "t" },
  },
}
