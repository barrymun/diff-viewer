import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, Table, TableBody, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { parsePatch, type ParsedDiff } from 'diff';

import VisuallyHiddenInput from '../styled/visuallyHiddenInput';
import HunkViewer from './hunkViewer';
import HunkHeader from './hunkHeader';
import { generateHunkHeader } from '../../utils/helpers';

export function PatchViewer() {
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
  };

  return (
    <Box>
      <Typography variant="h4">Patch Viewer (Side-by-Side)</Typography>
      
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

      {(parsed ?? []).map((file, i) => (
        <Box key={i} sx={{ marginTop: spacing(3) }}>
          <Typography variant="h6">{file.oldFileName} → {file.newFileName}</Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: spacing(2) }}>
          
            {file.hunks.map((hunk, hunkIndex) => (
              <Box>
                <HunkHeader>{generateHunkHeader(hunk)}</HunkHeader>
                <Box key={hunkIndex} sx={{ display: "flex", gap: spacing(2) }}>
                  <Box sx={{ width: "50%", overflowX: "scroll" }}>
                    <Table>
                      <TableBody>
                        <HunkViewer hunk={hunk} lineVersion="old" />
                      </TableBody>
                    </Table>
                  </Box>

                  <Box sx={{ width: "50%", overflowX: "scroll" }}>
                    <Table>
                      <TableBody>
                        <HunkViewer hunk={hunk} lineVersion="new" />
                      </TableBody>
                    </Table>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

        </Box>
      ))}
    </Box>
  );
};
