return {
  -- Issues
  {
    "<leader>oil",
    "<cmd>Octo issue list<cr>",
    desc = "List issues",
  },
  {
    "<leader>ois",
    "<cmd>Octo issue search<cr>",
    desc = "Search issues",
  },
  {
    "<leader>oic",
    "<cmd>Octo issue create<cr>",
    desc = "Create issue",
  },
  {
    "<leader>oio",
    "<cmd>Octo issue browser<cr>",
    desc = "Open issue in browser",
  },
  {
    "<leader>oix",
    "<cmd>Octo issue close<cr>",
    desc = "Close issue",
  },
  {
    "<leader>oir",
    "<cmd>Octo issue reopen<cr>",
    desc = "Reopen issue",
  },

  -- Pull Requests
  {
    "<leader>opl",
    "<cmd>Octo pr list<cr>",
    desc = "List PRs",
  },
  {
    "<leader>ops",
    "<cmd>Octo pr search<cr>",
    desc = "Search PRs",
  },
  {
    "<leader>opc",
    "<cmd>Octo pr create<cr>",
    desc = "Create PR",
  },
  {
    "<leader>opo",
    "<cmd>Octo pr browser<cr>",
    desc = "Open PR in browser",
  },
  {
    "<leader>opk",
    "<cmd>Octo pr checkout<cr>",
    desc = "Checkout PR",
  },
  {
    "<leader>opd",
    "<cmd>Octo pr diff<cr>",
    desc = "Show PR diff",
  },
  {
    "<leader>opm",
    "<cmd>Octo pr merge<cr>",
    desc = "Merge PR",
  },
  {
    "<leader>opx",
    "<cmd>Octo pr close<cr>",
    desc = "Close PR",
  },
  {
    "<leader>opr",
    "<cmd>Octo pr ready<cr>",
    desc = "Mark PR ready",
  },
  {
    "<leader>opt",
    "<cmd>Octo pr checks<cr>",
    desc = "Show PR checks",
  },

  -- Review
  {
    "<leader>ors",
    "<cmd>Octo review start<cr>",
    desc = "Start review",
  },
  {
    "<leader>orr",
    "<cmd>Octo review resume<cr>",
    desc = "Resume review",
  },
  {
    "<leader>orm",
    "<cmd>Octo review submit<cr>",
    desc = "Submit review",
  },
  {
    "<leader>ord",
    "<cmd>Octo review discard<cr>",
    desc = "Discard review",
  },

  -- Comments
  {
    "<leader>oca",
    "<cmd>Octo comment add<cr>",
    desc = "Add comment",
  },
  {
    "<leader>ocd",
    "<cmd>Octo comment delete<cr>",
    desc = "Delete comment",
  },

  -- Labels
  {
    "<leader>ola",
    "<cmd>Octo label add<cr>",
    desc = "Add label",
  },
  {
    "<leader>olr",
    "<cmd>Octo label remove<cr>",
    desc = "Remove label",
  },

  -- Assignees
  {
    "<leader>oaa",
    "<cmd>Octo assignee add<cr>",
    desc = "Add assignee",
  },
  {
    "<leader>oar",
    "<cmd>Octo assignee remove<cr>",
    desc = "Remove assignee",
  },

  -- Reviewers
  {
    "<leader>ova",
    "<cmd>Octo reviewer add<cr>",
    desc = "Add reviewer",
  },

  -- Reactions
  {
    "<leader>o+",
    "<cmd>Octo reaction thumbs_up<cr>",
    desc = "Reaction +1",
  },
  {
    "<leader>o-",
    "<cmd>Octo reaction thumbs_down<cr>",
    desc = "Reaction -1",
  },
  {
    "<leader>oh",
    "<cmd>Octo reaction heart<cr>",
    desc = "Reaction heart",
  },

  -- Repo
  {
    "<leader>oRl",
    "<cmd>Octo repo list<cr>",
    desc = "List repos",
  },
  {
    "<leader>oRo",
    "<cmd>Octo repo browser<cr>",
    desc = "Open repo in browser",
  },

  -- Search & misc
  {
    "<leader>o/",
    "<cmd>Octo search<cr>",
    desc = "Search GitHub",
  },
  {
    "<leader>on",
    "<cmd>Octo notification list<cr>",
    desc = "List notifications",
  },

  -- Thread
  {
    "<leader>otr",
    "<cmd>Octo thread resolve<cr>",
    desc = "Resolve thread",
  },
  {
    "<leader>otu",
    "<cmd>Octo thread unresolve<cr>",
    desc = "Unresolve thread",
  },
}
