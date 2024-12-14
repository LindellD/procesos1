import React from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import {
  TrendingUp,
  BarChart,
  PieChart,
  BugReport,
  Description,
  Calculate
} from '@mui/icons-material';

const DashboardModule = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido a SigmaHubIQ
      </Typography>

      <Typography variant="body1" gutterBottom>
        SigmaHubIQ es un sistema diseñado para implementar los principios de 
        <strong> Six Sigma</strong>, una metodología enfocada en la mejora continua de procesos 
        mediante el análisis estadístico y la reducción de defectos. Aquí encontrarás herramientas 
        avanzadas para la gestión y análisis de datos que te ayudarán a optimizar la calidad y 
        eficiencia de tus procesos.
      </Typography>

      <Typography variant="body2" color="textSecondary" gutterBottom>
        Módulos disponibles:
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <TrendingUp sx={{ fontSize: 40 }} />
            <Typography variant="h6" mt={1}>
              Dashboard de KPIs
            </Typography>
            <Typography variant="body2">
              Visualiza los indicadores clave de rendimiento en tiempo real.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <BarChart sx={{ fontSize: 40 }} />
            <Typography variant="h6" mt={1}>
              7 Herramientas LSS
            </Typography>
            <Typography variant="body2">
              Analiza datos con herramientas como Pareto, Ishikawa, y más.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <PieChart sx={{ fontSize: 40 }} />
            <Typography variant="h6" mt={1}>
              Estadísticas Básicas
            </Typography>
            <Typography variant="body2">
              Calcula estadísticas esenciales para tus procesos.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <BugReport sx={{ fontSize: 40 }} />
            <Typography variant="h6" mt={1}>
              Registro de Defectos
            </Typography>
            <Typography variant="body2">
              Registra y gestiona defectos para encontrar soluciones rápidas.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Description sx={{ fontSize: 40 }} />
            <Typography variant="h6" mt={1}>
              Generación de Reportes
            </Typography>
            <Typography variant="body2">
              Crea reportes detallados para documentar tus resultados.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Calculate sx={{ fontSize: 40 }} />
            <Typography variant="h6" mt={1}>
              Calculadora Six Sigma
            </Typography>
            <Typography variant="body2">
              Calcula métricas como Cp, Cpk, y más.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={4}>
        <Button variant="contained" color="primary">
          Explorar Módulos
        </Button>
      </Box>
    </Box>
  );
};

export default DashboardModule;
