import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Drawer, IconButton, Toolbar, Typography, useTheme } from '@mui/material'

import DiffViewer from '../../features/diffViewer'
import { drawerWidth } from '../../utils/constants'
import { Header } from '../styled/header'
import { useState } from 'react';
import { DrawerHeader } from '../styled/drawerHeader';
import { Main } from '../styled/main';

export default function App() {
  const { direction } = useTheme();

  const [open, setOpen] = useState<boolean>(false);

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
                open && { display: 'none' },
              ]}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h4">Diff Viewer (Side-by-Side)</Typography>
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
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            {direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
      </Drawer>
    </>
  )
}
