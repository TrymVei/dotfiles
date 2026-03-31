return {
  {
    "<leader>ac",
    "<cmd>ClaudeCode<cr>",
    desc = "Toggle Claude Code",
  },
  {
    "<leader>af",
    "<cmd>ClaudeCodeFocus<cr>",
    desc = "Focus Claude Code",
  },
  {
    "<leader>am",
    "<cmd>ClaudeCodeSelectModel<cr>",
    desc = "Select Claude Model",
  },
  {
    "<leader>as",
    "<cmd>ClaudeCodeSend<cr>",
    mode = "v",
    desc = "Send to Claude",
  },
  {
    "<leader>aa",
    "<cmd>ClaudeCodeAdd %<cr>",
    desc = "Add Current File to Context",
  },
  {
    "<leader>ad",
    "<cmd>ClaudeCodeDiffAccept<cr>",
    desc = "Accept Diff",
  },
  {
    "<leader>aD",
    "<cmd>ClaudeCodeDiffDeny<cr>",
    desc = "Deny Diff",
  },
}
