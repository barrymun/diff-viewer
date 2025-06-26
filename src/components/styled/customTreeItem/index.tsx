import { styled } from "@mui/material";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view";

export const CustomTreeItem = styled(TreeItem)(() => ({
  [`& .${treeItemClasses.content}`]: {
    [`& .${treeItemClasses.label}`]: {
      fontSize: "0.75rem",
    },
  },
}));
