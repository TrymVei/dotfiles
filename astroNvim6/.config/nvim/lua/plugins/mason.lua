-- Customize Mason

---@type LazySpec
return {
  -- use mason-tool-installer for automatically installing Mason packages
  {
    "WhoIsSethDaniel/mason-tool-installer.nvim",
    -- overrides `require("mason-tool-installer").setup(...)`
    opts = {
      -- Make sure to use the names found in `:Mason`
      ensure_installed = {
        -- install language servers
        "lua-language-server",
        "astro-language-server",
        "typescript-language-server",
        "tailwindcss-language-server",
        "yaml-language-server",
        "css-variables-language-server",
        "css-lsp",
        "omnisharp",
        -- "volar",

        -- install formatters
        "stylua",
        "ruff",
        "prettier",

        -- install debuggers
        "debugpy",

        -- install any other package
        "tree-sitter-cli",
      },
    },
  },
}
