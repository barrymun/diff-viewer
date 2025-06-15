import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button } from "@mui/material";
import { parsePatch } from 'diff';

import VisuallyHiddenInput from "../../../../components/styled/visuallyHiddenInput";
import { useAppState } from '../../../../hooks/useAppState';

export default function UploadButton() {
  const { setParsedDiffs } = useAppState();

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
  );
}
