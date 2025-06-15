import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { parsePatch } from 'diff';

import SplitViewer from './splitViewer';
import UnifiedViewer from './unifiedViewer';
import { formatFileChangePath } from '../../utils/helpers';
import { useAppState } from '../../hooks/useAppState';
import UploadButton from './components/uploadButton';
import ViewToggle from './components/viewToggle';

export default function DiffViewer() {
  const { spacing } = useTheme();
  const { diffViewType, selectedParsedDiffs, setParsedDiffs } = useAppState();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const content = await file.text();
    const parsedPatch = parsePatch(content);
    setParsedDiffs(parsedPatch);
  };

  return (
    <Box sx={{ display: "grid", gap: spacing(2) }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: spacing(1) }}>
        <UploadButton onChange={handleFileUpload} />

        <ViewToggle />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: spacing(3), width: "100%" }}>
        {(selectedParsedDiffs ?? []).map((structuredPatch, i) => {
          const { fileChangeType, formattedPath } = formatFileChangePath(structuredPatch.oldFileName, structuredPatch.newFileName);

          return (
            <Box key={i} sx={{ minWidth: 0, display: "grid", gap: spacing(1) }}>
              <Box sx={{ minWidth: 0, display: "flex", alignItems: "center", gap: spacing(1) }}>
                <Typography variant="h6">{formattedPath}</Typography>
                {/* TODO: extract this to its own component with different colors for the different states */}
                <Typography variant="h6" sx={{ color: "blue.600", border: 1, borderRadius: spacing(0.5), borderColor: "blue.600", px: spacing(1) }}>{fileChangeType}</Typography>
              </Box>
    
              <Box sx={{ minWidth: 0, border: 1, borderColor: "grey.600" }}>
                {diffViewType === "split" && <SplitViewer structuredPatch={structuredPatch} />}
                {diffViewType === 'unified' && <UnifiedViewer structuredPatch={structuredPatch} />}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
