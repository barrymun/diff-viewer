import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Drawer, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { Bounce, ToastContainer } from "react-toastify";

import Loader from "@/components/loader";
import { DrawerHeader } from "@/components/styled/drawerHeader";
import { Header } from "@/components/styled/header";
import { Main } from "@/components/styled/main";
import DiffViewer from "@/features/diffViewer";
import DirectoryTree from "@/features/directoryTree";
import { drawerWidth } from "@/utils/constants";

export default function App() {
  const { breakpoints, direction, spacing } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down("sm"));

  const [open, setOpen] = useState<boolean>(!isMobile);

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateAreas: `"header" "content"`,
          gridTemplateRows: "auto 1fr",
          height: "100vh",
        }}
      >
        <Header position="static" open={open} sx={{ gridArea: "header" }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(true)}
              edge="start"
              sx={[
                {
                  mr: 2,
                },
                open && { display: "none" },
              ]}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h4">Diff Viewer</Typography>
          </Toolbar>
        </Header>

        <Main open={open} sx={{ gridArea: "content" }}>
          <DiffViewer />
        </Main>
      </Box>

      <Drawer
        open={open}
        variant="persistent"
        anchor="left"
        sx={{
          width: {
            xs: "100%",
            sm: drawerWidth,
          },
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: {
              xs: "100%",
              sm: drawerWidth,
            },
            boxSizing: "border-box",
            overflowY: "hidden",
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            {direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>

        <Box sx={{ px: spacing(1), py: spacing(2), overflowY: "auto" }}>
          <DirectoryTree />
        </Box>
      </Drawer>

      <Loader />

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        // theme="dark"
        transition={Bounce}
      />
    </>
  );
}
