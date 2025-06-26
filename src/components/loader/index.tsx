import { Box, LinearProgress } from "@mui/material";

import { useCustomStore } from "@/zustand/store";

export default function Loader() {
  const { isLoading } = useCustomStore();

  if (!isLoading) return null;

  return (
    <Box sx={{ position: "fixed", top: 0, width: "100%" }}>
      <LinearProgress color="secondary" />
    </Box>
  );
}
