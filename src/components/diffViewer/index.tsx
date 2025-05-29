import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, Table, TableBody, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { parsePatch, type ParsedDiff } from 'diff';

import VisuallyHiddenInput from '../styled/visuallyHiddenInput';
import HunkViewer from './hunkViewer';
// import HunkHeader from './hunkHeader';
import { formatFileChangePath } from '../../utils/helpers';

export function DiffViewer() {
  const { spacing } = useTheme();

  const [parsed, setParsed] = useState<ParsedDiff[] | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const content = await file.text();
    const parsedPatch = parsePatch(content);
    setParsed(parsedPatch);
    // setParsed(parsedPatch.length > 0 ? [parsedPatch[0]] : []);
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

      <Box sx={{ display: "grid", gap: spacing(3), gridTemplateColumns: "1fr", width: "100%" }}>
        {(parsed ?? []).map((file, i) => {
          const { fileChangeType, formattedPath } = formatFileChangePath(file.oldFileName, file.newFileName);

          return (
            <Box key={i} sx={{ minWidth: 0, display: "grid", gap: spacing(1) }}>
              <Box sx={{ minWidth: 0, display: "flex", alignItems: "center", gap: spacing(1) }}>
                <Typography variant="h6">{formattedPath}</Typography>
                {/* TODO: extract this to its own component with different colors for the different states */}
                <Typography variant="h6" sx={{ color: "blue.600", border: 1, borderRadius: spacing(0.5), borderColor: "blue.600", px: spacing(1) }}>{fileChangeType}</Typography>
              </Box>
    
              <Box sx={{ minWidth: 0, display: "flex", border: 1, borderColor: "grey.600" }}>
                <Table>
                  <TableBody>
                    {file.hunks.map((hunk, hunkIndex) => (
                      <React.Fragment key={hunkIndex}>
                        {/* <HunkHeader>{generateHunkHeader(hunk)}</HunkHeader> */}
                        <HunkViewer hunk={hunk} />
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
