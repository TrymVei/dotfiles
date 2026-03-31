require("snacks").setup {
  bigfile = { enabled = true },
  dashboard = { enabled = true },
  explorer = { enabled = true },
  indent = { enabled = true },
  input = { enabled = true },
  terminal = { enabled = true },
  picker = {
    enabled = true,
    layout = { preset = "narrow_list_wide_preview" },
    layouts = {
      narrow_list_wide_preview = {
        fullscreen = true,
        layout = {
          box = "horizontal",
          {
            box = "vertical",
            border = true,
            title = "{title} {live} {flags}",
            { win = "input", height = 1, border = "bottom" },
            { win = "list", border = "none", width = 100 },
          },
          { win = "preview", title = "{preview}", border = true, width = 0.75 },
        },
      },
      keymaps_layout = {
        fullscreen = true,
        layout = {
          box = "vertical",
          { win = "input", height = 1, border = "bottom" },
          { win = "list", border = "top" },
        },
      },
    },
    win = {
      input = { height = 1 },
    },
    sources = {
      keymaps = {
        layout = { preset = "keymaps_layout" },
      },
    },
  },
  notifier = { enabled = true },
  quickfile = { enabled = true },
  scope = { enabled = true },
  scroll = { enabled = true },
  statuscolumn = { enabled = true },
  words = { enabled = true },
}
