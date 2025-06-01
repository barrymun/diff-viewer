import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { parsePatch, type ParsedDiff } from 'diff';

import VisuallyHiddenInput from '../styled/visuallyHiddenInput';
import SideBySideViewer from './sideBySideViewer';
import { formatFileChangePath } from '../../utils/helpers';

export function DiffViewer() {
  const { spacing } = useTheme();

  const [parsedDiffs, setParsedDiffs] = useState<ParsedDiff[] | null>(null);

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
    <Box sx={{ p: spacing(1) }}>
      <Typography variant="h4">Diff Viewer (Side-by-Side)</Typography>
      
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
          multiple
        />
      </Button>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: spacing(3), width: "100%" }}>
        {(parsedDiffs ?? []).map((parsedDiff, i) => {
          const { fileChangeType, formattedPath } = formatFileChangePath(parsedDiff.oldFileName, parsedDiff.newFileName);

          return (
            <Box key={i} sx={{ minWidth: 0, display: "grid", gap: spacing(1) }}>
              <Box sx={{ minWidth: 0, display: "flex", alignItems: "center", gap: spacing(1) }}>
                <Typography variant="h6">{formattedPath}</Typography>
                {/* TODO: extract this to its own component with different colors for the different states */}
                <Typography variant="h6" sx={{ color: "blue.600", border: 1, borderRadius: spacing(0.5), borderColor: "blue.600", px: spacing(1) }}>{fileChangeType}</Typography>
              </Box>
    
              <Box sx={{ minWidth: 0, border: 1, borderColor: "grey.600" }}>
                <SideBySideViewer parsedDiff={parsedDiff} />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
