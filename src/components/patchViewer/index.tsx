import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Button, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { parsePatch, type ParsedDiff } from 'diff';

import VisuallyHiddenInput from '../styled/visuallyHiddenInput';
import { getAlignedLinesWithNumbers } from '../../utils/helpers';

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
          onChange={handleFileUpload}
          multiple
        />
      </Button>

      {parsed?.map((file, i) => (
        <Box key={i} sx={{ marginTop: spacing(3) }}>
          <Typography variant="h6">{file.oldFileName} → {file.newFileName}</Typography>

          {file.hunks.map((hunk, j) => {
            const aligned = getAlignedLinesWithNumbers(hunk.lines, hunk.oldStart, hunk.newStart);

            return (
              <Box key={j} sx={{ display: "flex", gap: spacing(2) }}>
                {/* Left side */}
                <Box sx={{ width: "50%", overflowX: "scroll", padding: spacing(2), bgcolor: "grey.50" }}>
                  {aligned.map((line, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        ...(!line.oldLine && { bgcolor: "grey.200" }),
                        ...(line.oldLine?.startsWith('-') && { bgcolor: "#ffecec" }),
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ width: 40, textAlign: "right", pr: 2, color: "grey.600" }}
                      >
                        {line.oldLineNumber ?? ''}
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: "pre" }}>
                        {line.oldLine ?? ' '}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Right side */}
                <Box sx={{ width: "50%", overflowX: "scroll", padding: spacing(2), bgcolor: "grey.50" }}>
                  {aligned.map((line, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        ...(!line.newLine && { bgcolor: "grey.200" }),
                        ...(line.newLine?.startsWith('+') && { bgcolor: "#eaffea" }),
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ width: 40, textAlign: "right", pr: 2, color: "grey.600" }}
                      >
                        {line.newLineNumber ?? ''}
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: "pre" }}>
                        {line.newLine ?? ' '}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}

        </Box>
      ))}
    </Box>
  );
};
