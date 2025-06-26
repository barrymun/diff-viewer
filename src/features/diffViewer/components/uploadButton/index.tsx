import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button } from "@mui/material";
import { parsePatch } from "diff";
import { useEffect } from "react";
import { toast } from "react-toastify";

import VisuallyHiddenInput from "@/components/styled/visuallyHiddenInput";
import { useAppState } from "@/hooks/useAppState";
import { useCustomStore } from "@/zustand/store";

export default function UploadButton() {
  const { startLoading, stopLoading } = useCustomStore();
  const { parsedDiffs, setParsedDiffs } = useAppState();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      startLoading();
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }

      const content = await file.text();
      const parsedPatch = parsePatch(content);
      setParsedDiffs(parsedPatch);
      toast.success("Patch uploaded successfully.");
    } catch {
      stopLoading();
      setParsedDiffs(null);
      toast.error("The uploaded file appears to be corrupted or in an invalid format.");
    }
  };

  /**
   *
   */
  useEffect(() => {
    stopLoading();
  }, [parsedDiffs, stopLoading]);

  return (
    <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
      Upload files
      <VisuallyHiddenInput type="file" accept=".diff,.patch,.txt" onChange={handleFileUpload} />
    </Button>
  );
}
