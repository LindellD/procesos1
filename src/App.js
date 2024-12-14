import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Grid
} from '@mui/material';
import {
  Menu as MenuIcon,
  LayoutDashboard,
  Wrench,
  LineChart,
  Bug,
  Description,
  Calculator,
  FileIcon
} from 'lucide-react';

// Importación de los módulos 
import DashboardModule from './modules/DashboardModule';
import LSSToolsModule from './modules/LSSToolsModule';
import StatisticsModule from './modules/StatisticsModule';
import DefectTrackingModule from './modules/DefectTrackingModule';
import ReportsModule from './modules/ReportsModule';
import SixSigmaCalculatorModule from './modules/SixSigmaCalculatorModule';
import FileAnalyzer from './components/FileAnalyzer';

const drawerWidth = 240;

const App = () => {
  const [open, setOpen] = useState(true);
  const [currentModule, setCurrentModule] = useState('dashboard');

  const modules = [
    { id: 'dashboard', name: 'Inicio', icon: <LayoutDashboard />, component: <DashboardModule /> },
    { id: 'lsstools', name: 'Herramientas LSS', icon: <Wrench/>, component: <LSSToolsModule /> },
    { id: 'statistics', name: 'Estadísticas', icon: <LineChart />, component: <StatisticsModule /> },
    { id: 'defects', name: 'Registro de Defectos', icon: <Bug />, component: <DefectTrackingModule /> },
    { id: 'reports', name: 'Reportes', icon: <FileIcon />, component: <ReportsModule /> },
    { id: 'calculator', name: 'Calculadora Six Sigma', icon: <Calculator />, component: <SixSigmaCalculatorModule /> },
    { id: 'Analizer', name: 'Analizar', icon: <Calculator />, component: <FileAnalyzer /> }
  ];

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ marginRight: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Six Sigma Tools
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {modules.map((module) => (
              <ListItem 
                button 
                key={module.id}
                onClick={() => setCurrentModule(module.id)}
                selected={currentModule === module.id}
              >
                <ListItemIcon>{module.icon}</ListItemIcon>
                <ListItemText primary={module.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {modules.find(m => m.id === currentModule)?.component}
      </Box>
    </Box>
  );
};

export default App;