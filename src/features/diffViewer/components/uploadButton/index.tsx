import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button } from "@mui/material";

import VisuallyHiddenInput from "../../../../components/styled/visuallyHiddenInput";

interface UploadButtonProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export default function UploadButton({ onChange }: UploadButtonProps) {
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
        onChange={onChange}
      />
    </Button>
  );
}
