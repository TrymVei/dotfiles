require("neotest").setup {
  adapters = {
    require "neotest-python" {
      dap = { justMyCode = false },
      runner = "pytest",
    },
    require "neotest-jest" {
      jestCommand = "npm test --",
      jestArguments = function(defaultArguments, context) return defaultArguments end,
      jestConfigFile = "jest.config.js",
      env = { CI = true },
      cwd = function(path)
        local function find_ancestor(p, target)
          local dir = vim.fn.fnamemodify(p, ":h")
          if vim.fn.filereadable(dir .. "/" .. target) == 1 then return dir end
          local parent = vim.fn.fnamemodify(dir, ":h")
          if parent == dir then return vim.fn.getcwd() end
          return find_ancestor(parent, target)
        end
        return find_ancestor(path, "jest.config.js")
      end,
      isTestFile = require("neotest-jest.jest-util").defaultIsTestFile,
    },
  },
}
