import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { parsePatch, type StructuredPatch } from 'diff';

import VisuallyHiddenInput from '../../components/styled/visuallyHiddenInput';
import SplitViewer from './splitViewer';
import { formatFileChangePath } from '../../utils/helpers';

export function DiffViewer() {
  const { spacing } = useTheme();

  const [parsedDiffs, setParsedDiffs] = useState<StructuredPatch[] | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const content = await file.text();
    const parsedPatch = parsePatch(content);
    setParsedDiffs(parsedPatch);
    // setParsedDiffs(parsedPatch.length > 0 ? [parsedPatch[0]] : []);
  };

  return (
    <>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload files
        <VisuallyHiddenInput
          type="file"
          accept=".diff,.patch,.txt"
          onChange={handleFileUpload}
          // multiple
        />
      </Button>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: spacing(3), width: "100%" }}>
        {(parsedDiffs ?? []).map((structuredPatch, i) => {
          const { fileChangeType, formattedPath } = formatFileChangePath(structuredPatch.oldFileName, structuredPatch.newFileName);

          return (
            <Box key={i} sx={{ minWidth: 0, display: "grid", gap: spacing(1) }}>
              <Box sx={{ minWidth: 0, display: "flex", alignItems: "center", gap: spacing(1) }}>
                <Typography variant="h6">{formattedPath}</Typography>
                {/* TODO: extract this to its own component with different colors for the different states */}
                <Typography variant="h6" sx={{ color: "blue.600", border: 1, borderRadius: spacing(0.5), borderColor: "blue.600", px: spacing(1) }}>{fileChangeType}</Typography>
              </Box>
    
              <Box sx={{ minWidth: 0, border: 1, borderColor: "grey.600" }}>
                <SplitViewer structuredPatch={structuredPatch} />
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
};
