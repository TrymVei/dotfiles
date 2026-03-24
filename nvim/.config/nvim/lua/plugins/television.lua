return {
  "alexpasmantier/tv.nvim",
  lazy = false,
  priority = 1000,
  config = function() require "configs.television" end,
  keys = require "mapping.television",
}
