import { Typography, useTheme } from "@mui/material";
import type { StructuredPatch } from "diff";

import { formatFileChangePath } from "../../../../utils/helpers";
import { useMemo } from "react";

interface PatchInfoProps {
  structuredPatch: StructuredPatch;
}

export default function PatchInfo({ structuredPatch }: PatchInfoProps) {
  const { spacing } = useTheme();

  const { fileChangeType, formattedPath } = useMemo(
    () => formatFileChangePath(structuredPatch.oldFileName, structuredPatch.newFileName),
    [structuredPatch.newFileName, structuredPatch.oldFileName]
  );

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {/* Insert zero-width space after slashes so that the text will break on a slash for longer paths. */}
        {formattedPath.replace(/\//g, '/\u200B')}
      </Typography>
      <Typography 
        variant="h6" 
        sx={{ 
          color: "blue.600", 
          border: 1, 
          borderRadius: spacing(0.5), 
          borderColor: "blue.600", 
          px: spacing(1),
        }}
      >
        {fileChangeType}
      </Typography>
    </>
  );
}
