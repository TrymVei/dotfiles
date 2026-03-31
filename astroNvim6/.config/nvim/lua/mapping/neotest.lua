return {
  { "<leader>tt", desc = "Neotest +" },
  { "<leader>ttr", function() require("neotest").run.run() end, desc = "Run nearest" },
  { "<leader>ttf", function() require("neotest").run.run(vim.fn.expand "%") end, desc = "Run file" },
  { "<leader>ttp", function() require("neotest").output_panel.toggle() end, desc = "Toggle panel" },
  { "<leader>tts", function() require("neotest").summary.toggle() end, desc = "Toggle summary" },
}
