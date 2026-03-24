return {
  "folke/snacks.nvim",
  enabled = false,
  priority = 1000,
  lazy = false,
  config = function() require "configs.snacks" end,
  keys = require "mapping.snacks",
}
