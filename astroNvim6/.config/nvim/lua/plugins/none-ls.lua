-- Customize None-ls sources

---@type LazySpec
return {
  "nvimtools/none-ls.nvim",
  opts = function(_, opts)
    local null_ls = require "null-ls"

    opts.sources = require("astrocore").list_insert_unique(opts.sources, {
      null_ls.builtins.formatting.prettier.with({
        -- Prettier will automatically find the config file closest to the file being formatted
        prefer_local = "node_modules/.bin",
      }),
    })
  end,
}
