return {
  {
    "<leader>ai",
    function() require("opencode").ask "@this: " end,
    mode = { "n", "x" },
    desc = "Ask opencode",
  },
  {
    "<leader>ae",
    function() require("opencode").select() end,
    mode = { "n", "x" },
    desc = "Opencode actions",
  },
  {
    "<leader>at",
    function() require("opencode").toggle() end,
    mode = { "n" },
    desc = "Toggle opencode",
  },
  {
    "<leader>aS",
    function() require("opencode").stop() end,
    mode = "n",
    desc = "Stop opencode",
  },
  {
    "<leader>aR",
    function()
      require("opencode").stop()
      require("opencode").start()
    end,
    mode = "n",
    desc = "Restart opencode",
  },
  {
    "<C-a>",
    function() require("opencode").ask("@this: ", { submit = true }) end,
    mode = { "n", "x" },
    desc = "Ask opencode...",
  },
  {
    "<C-x>",
    function() require("opencode").select() end,
    mode = { "n", "x" },
    desc = "Execute opencode action...",
  },
  {
    "go",
    function() return require("opencode").operator "@this " end,
    mode = { "n", "x" },
    expr = true,
    desc = "Add range to opencode",
  },
  {
    "goo",
    function() return require("opencode").operator "@this " .. "_" end,
    mode = "n",
    expr = true,
    desc = "Add line to opencode",
  },
  {
    "<S-C-u>",
    function() require("opencode").command "session.half.page.up" end,
    mode = "n",
    desc = "Scroll opencode up",
  },
  {
    "<S-C-d>",
    function() require("opencode").command "session.half.page.down" end,
    mode = "n",
    desc = "Scroll opencode down",
  },
  {
    "+",
    "<C-a>",
    mode = "n",
    noremap = true,
    desc = "Increment under cursor",
  },
  {
    "-",
    "<C-x>",
    mode = "n",
    noremap = true,
    desc = "Decrement under cursor",
  },
}
