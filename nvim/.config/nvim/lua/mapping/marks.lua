return {
  {
    "<leader>m",
    "",
    desc = "Marks",
  },
  {
    "<leader>ml",
    "<cmd>MarksListBuf<cr>",
    desc = "Marks: list in buffer",
  },
  {
    "<leader>mn",
    "<Plug>(Marks-next)",
    remap = true,
    desc = "Marks: next",
  },
  {
    "<leader>mp",
    "<Plug>(Marks-prev)",
    remap = true,
    desc = "Marks: previous",
  },
  {
    "<leader>md",
    "<Plug>(Marks-deletebuf)",
    remap = true,
    desc = "Marks: delete in buffer",
  },
}
