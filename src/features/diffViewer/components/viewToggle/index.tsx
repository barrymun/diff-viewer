import { ToggleButton, ToggleButtonGroup } from "@mui/material";

import { useAppState } from "../../../../hooks/useAppState";

export default function ViewToggle() {
  const { diffViewType, setDiffViewType } = useAppState();

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: typeof diffViewType | null
  ) => {
    if (newView) {
      setDiffViewType(newView);
    }
  };

  return (
    <ToggleButtonGroup
      exclusive
      value={diffViewType}
      onChange={handleViewChange}
      aria-label="diff view"
      size="small"
    >
      <ToggleButton value="unified" aria-label="unified view">
        Unified
      </ToggleButton>
      <ToggleButton value="split" aria-label="split view">
        Split
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
