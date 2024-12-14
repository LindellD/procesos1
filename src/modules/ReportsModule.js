import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  FileText,
  Download,
  Calendar,
  PieChart,
  LineChart,
  ClipboardList,
  Filter
} from 'lucide-react';

const ReportsModule = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [filters, setFilters] = useState({
    process: '',
    category: '',
    severity: ''
  });

  const reportTypes = [
    {
      id: 'process-performance',
      name: 'Rendimiento del Proceso',
      icon: <LineChart />,
      description: 'Análisis detallado del rendimiento del proceso incluyendo métricas clave y tendencias'
    },
    {
      id: 'defect-analysis',
      name: 'Análisis de Defectos',
      icon: <PieChart />,
      description: 'Resumen de defectos, categorización y análisis de causa raíz'
    },
    {
      id: 'improvement-tracking',
      name: 'Seguimiento de Mejoras',
      icon: <ClipboardList />,
      description: 'Registro de iniciativas de mejora y su impacto en el proceso'
    }
  ];

  const handleGenerateReport = () => {
    // Aquí iría la lógica de generación de reportes
    console.log('Generando reporte:', {
      type: selectedReport,
      dateRange,
      filters
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Generación de Reportes
      </Typography>

      <Grid container spacing={3}>
        {/* Selección de Tipo de Reporte */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Seleccionar Reporte
              </Typography>
              <List>
                {reportTypes.map((report) => (
                  <ListItem
                    button
                    key={report.id}
                    selected={selectedReport === report.id}
                    onClick={() => setSelectedReport(report.id)}
                  >
                    <ListItemIcon>
                      {report.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={report.name}
                      secondary={report.description}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Configuración del Reporte */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configuración del Reporte
              </Typography>

              {selectedReport && (
                <Grid container spacing={3}>
                  {/* Rango de Fechas */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      <Calendar size={18} style={{ marginRight: 8, verticalAlign: 'text-bottom' }}/>
                      Período del Reporte
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Fecha Inicio"
                          value={dateRange.start}
                          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          type="date"
                          label="Fecha Fin"
                          value={dateRange.end}
                          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Filtros */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      <Filter size={18} style={{ marginRight: 8, verticalAlign: 'text-bottom' }}/>
                      Filtros
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                          <InputLabel>Proceso</InputLabel>
                          <Select
                            value={filters.process}
                            label="Proceso"
                            onChange={(e) => setFilters({ ...filters, process: e.target.value })}
                          >
                            <MenuItem value="proceso1">Proceso 1</MenuItem>
                            <MenuItem value="proceso2">Proceso 2</MenuItem>
                            <MenuItem value="proceso3">Proceso 3</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                          <InputLabel>Categoría</InputLabel>
                          <Select
                            value={filters.category}
                            label="Categoría"
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                          >
                            <MenuItem value="material">Material</MenuItem>
                            <MenuItem value="maquinaria">Maquinaria</MenuItem>
                            <MenuItem value="metodo">Método</MenuItem>
                            <MenuItem value="mano-obra">Mano de Obra</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                          <InputLabel>Severidad</InputLabel>
                          <Select
                            value={filters.severity}
                            label="Severidad"
                            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                          >
                            <MenuItem value="critico">Crítico</MenuItem>
                            <MenuItem value="mayor">Mayor</MenuItem>
                            <MenuItem value="menor">Menor</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Opciones de Exportación */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      <Download size={18} style={{ marginRight: 8, verticalAlign: 'text-bottom' }}/>
                      Formato de Exportación
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Button 
                          variant="outlined" 
                          startIcon={<FileText />}
                          onClick={() => handleGenerateReport('pdf')}
                        >
                          PDF
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button 
                          variant="outlined" 
                          startIcon={<FileText />}
                          onClick={() => handleGenerateReport('excel')}
                        >
                          Excel
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Botón de Generación */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      onClick={handleGenerateReport}
                      disabled={!dateRange.start || !dateRange.end}
                    >
                      Generar Reporte
                    </Button>
                  </Grid>
                </Grid>
              )}

              {!selectedReport && (
                <Typography color="textSecondary" align="center">
                  Selecciona un tipo de reporte para comenzar
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsModule;