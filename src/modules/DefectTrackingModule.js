import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import { Edit, Trash2, Plus } from 'lucide-react';

const DefectTrackingModule = () => {
  const [defects, setDefects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDefect, setEditingDefect] = useState(null);
  
  const initialDefectState = {
    id: '',
    date: '',
    process: '',
    description: '',
    severity: '',
    status: 'abierto',
    assignedTo: '',
    category: '',
    rootCause: '',
    action: ''
  };

  const [newDefect, setNewDefect] = useState(initialDefectState);

  const categories = [
    'Material',
    'Maquinaria',
    'Método',
    'Mano de Obra',
    'Medición',
    'Medio Ambiente'
  ];

  const severities = [
    'Crítico',
    'Mayor',
    'Menor',
    'Observación'
  ];

  const statuses = [
    'abierto',
    'en análisis',
    'en corrección',
    'verificación',
    'cerrado'
  ];

  const getStatusColor = (status) => {
    const colors = {
      'abierto': 'error',
      'en análisis': 'warning',
      'en corrección': 'info',
      'verificación': 'primary',
      'cerrado': 'success'
    };
    return colors[status] || 'default';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDefect(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (editingDefect) {
      setDefects(defects.map(d => 
        d.id === editingDefect.id ? { ...newDefect, id: d.id } : d
      ));
    } else {
      setDefects([...defects, {
        ...newDefect,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      }]);
    }
    handleCloseDialog();
  };

  const handleEdit = (defect) => {
    setEditingDefect(defect);
    setNewDefect(defect);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    setDefects(defects.filter(d => d.id !== id));
  };

  const handleOpenDialog = () => {
    setNewDefect(initialDefectState);
    setEditingDefect(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewDefect(initialDefectState);
    setEditingDefect(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Registro de Defectos
      </Typography>

      <Button
        variant="contained"
        startIcon={<Plus />}
        onClick={handleOpenDialog}
        sx={{ mb: 3 }}
      >
        Nuevo Defecto
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Proceso</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Severidad</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {defects.map((defect) => (
              <TableRow key={defect.id}>
                <TableCell>{defect.date}</TableCell>
                <TableCell>{defect.process}</TableCell>
                <TableCell>{defect.description}</TableCell>
                <TableCell>
                  <Chip 
                    label={defect.severity}
                    color={defect.severity === 'Crítico' ? 'error' : 
                           defect.severity === 'Mayor' ? 'warning' : 
                           defect.severity === 'Menor' ? 'info' : 'default'}
                  />
                </TableCell>
                <TableCell>{defect.category}</TableCell>
                <TableCell>
                  <Chip 
                    label={defect.status}
                    color={getStatusColor(defect.status)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(defect)} size="small">
                    <Edit size={18} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(defect.id)} size="small">
                    <Trash2 size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingDefect ? 'Editar Defecto' : 'Nuevo Defecto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Proceso"
                name="process"
                value={newDefect.process}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Severidad</InputLabel>
                <Select
                  name="severity"
                  value={newDefect.severity}
                  onChange={handleInputChange}
                  label="Severidad"
                >
                  {severities.map(severity => (
                    <MenuItem key={severity} value={severity}>
                      {severity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="description"
                value={newDefect.description}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  name="category"
                  value={newDefect.category}
                  onChange={handleInputChange}
                  label="Categoría"
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={newDefect.status}
                  onChange={handleInputChange}
                  label="Estado"
                >
                  {statuses.map(status => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Asignado a"
                name="assignedTo"
                value={newDefect.assignedTo}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Causa Raíz"
                name="rootCause"
                value={newDefect.rootCause}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Acción Correctiva"
                name="action"
                value={newDefect.action}
                onChange={handleInputChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingDefect ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DefectTrackingModule;