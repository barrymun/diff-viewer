import { styled } from "@mui/material";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view";
import isArray from "lodash/isArray";

export const CustomTreeItem = styled(TreeItem)(({ children }) => {
  return {
    [`& .${treeItemClasses.content}`]: {
      [`& .${treeItemClasses.label}`]: {
        fontSize: "0.75rem",
      },
    },
    // Hide checkbox if this item has children (is a directory)
    ...(isArray(children) &&
      children.length > 0 && {
        [`& > .${treeItemClasses.content} .${treeItemClasses.checkbox}`]: {
          display: "none",
        },
      }),
  };
});
