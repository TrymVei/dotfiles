local tv = function(channel)
  return function() require("tv").tv_channel(channel) end
end

return {
  -- find
  { "<leader>ff", tv "files", desc = "Find Files" },
  { "<leader>fg", tv "git-files", desc = "Find Git Files" },
  { "<leader>fr", tv "recent-files", desc = "Recent" },
  { "<leader>fw", tv "text", desc = "Grep" },
  { "<leader>f:", tv "zsh-history", desc = "Command History" },
  -- git
  { "<leader>gb", tv "git-branch", desc = "Git Branches" },
  { "<leader>gl", tv "git-log", desc = "Git Log" },
  { "<leader>gs", tv "git-diff", desc = "Git Diff" },
  { "<leader>gS", tv "git-stash", desc = "Git Stash" },
  { "<leader>gf", tv "git-log", desc = "Git Log File" },
  { "<leader>gt", tv "git-tags", desc = "Git Tags" },
  { "<leader>gw", tv "git-worktrees", desc = "Git Worktrees" },
  -- gh
  { "<leader>gi", tv "gh-issues", desc = "GitHub Issues" },
  { "<leader>gp", tv "gh-prs", desc = "GitHub Pull Requests" },
  -- search
  { "<leader>sM", tv "man-pages", desc = "Man Pages" },
  -- other channels
  { "<leader>fd", tv "docker-images", desc = "Docker Images" },
  { "<leader>fe", tv "env", desc = "Env Variables" },
  { "<leader>fc", function() require("tv").tv_channels() end, desc = "Channel Selector" },
}
