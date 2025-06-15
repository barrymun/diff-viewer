import { Box, useTheme } from '@mui/material';

import SplitViewer from './splitViewer';
import UnifiedViewer from './unifiedViewer';
import { useAppState } from '../../hooks/useAppState';
import UploadButton from './components/uploadButton';
import ViewToggle from './components/viewToggle';
import PatchInfo from './components/patchInfo';

export default function DiffViewer() {
  const { spacing } = useTheme();
  const { diffViewType, selectedParsedDiffs } = useAppState();

  return (
    <Box sx={{ display: "grid", gap: spacing(2) }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: spacing(1) }}>
        <UploadButton />

        <ViewToggle />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: spacing(3), width: "100%" }}>
        {(selectedParsedDiffs ?? []).map((structuredPatch, i) => (
          <Box key={i} sx={{ minWidth: 0, display: "grid", gap: spacing(1) }}>
            <Box sx={{ minWidth: 0, display: "flex", alignItems: "center", gap: spacing(1) }}>
              <PatchInfo structuredPatch={structuredPatch} />
            </Box>
  
            <Box sx={{ minWidth: 0, border: 1, borderColor: "grey.600" }}>
              {diffViewType === "split" && <SplitViewer structuredPatch={structuredPatch} />}
              {diffViewType === 'unified' && <UnifiedViewer structuredPatch={structuredPatch} />}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
