import { Box, Typography } from "@mui/material";

interface HunkHeaderProps {
  children?: React.ReactNode;
}

export default function HunkHeader({ children }: HunkHeaderProps) {
  return (
    <Box sx={{ bgcolor: "grey.50" }}>
      <Typography variant="body1" sx={{ color: "grey.500" }}>{children ?? "\u00a0"}</Typography>
    </Box>
  );
}
