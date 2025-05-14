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

          <Box sx={{ display: "flex", gap: spacing(2) }}>
            <Box sx={{ width: "50%", overflowX: "scroll" }}>
              <Table>
                <TableBody>
                  {file.hunks.map((hunk, hunkIndex) => (
                    <React.Fragment key={hunkIndex}>
                      <HunkHeader>{generateHunkHeader(hunk)}</HunkHeader>
                      <HunkViewer hunk={hunk} lineVersion="old" />
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </Box>

            <Box sx={{ width: "50%", overflowX: "scroll" }}>
              <Table>
                <TableBody>
                  {file.hunks.map((hunk, hunkIndex) => (
                    <React.Fragment key={hunkIndex}>
                      <HunkHeader />
                      <HunkViewer hunk={hunk} lineVersion="new" />
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>

        </Box>
      ))}
    </Box>
  );
};
