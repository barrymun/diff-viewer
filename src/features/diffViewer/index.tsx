import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { parsePatch, type StructuredPatch } from 'diff';

import VisuallyHiddenInput from '../../components/styled/visuallyHiddenInput';
import SplitViewer from './splitViewer';
import UnifiedViewer from './unifiedViewer';
import { formatFileChangePath } from '../../utils/helpers';
import { useDiffView } from '../../hooks/useDiffView';

export default function DiffViewer() {
  const { spacing } = useTheme();
  const { diffViewType, setDiffViewType } = useDiffView();

  const [parsedDiffs, setParsedDiffs] = useState<StructuredPatch[] | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const content = await file.text();
    const parsedPatch = parsePatch(content);
    setParsedDiffs(parsedPatch);
  };

  const handleViewChange = (_event: React.MouseEvent<HTMLElement>, newView: typeof diffViewType | null) => {
    if (newView) {
      setDiffViewType(newView);
    }
  };

  return (
    <Box sx={{ display: "grid", gap: spacing(2) }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: spacing(1) }}>
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
          />
        </Button>

        <ToggleButtonGroup
          exclusive
          value={diffViewType}
          onChange={handleViewChange}
          aria-label="diff view"
        >
          <ToggleButton value="unified" aria-label="unified view">
            Unified
          </ToggleButton>
          <ToggleButton value="split" aria-label="split view">
            Split
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

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
