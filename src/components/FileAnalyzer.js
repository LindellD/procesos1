import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Upload } from 'lucide-react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const FileAnalyzer = () => {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [columns, setColumns] = useState([]);
  const [fileName, setFileName] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');

  const calculateStats = (data, columns) => {
    const numericColumns = columns.filter(col => 
      data.some(row => typeof row[col] === 'number')
    );

    const stats = {};
    numericColumns.forEach(col => {
      const values = data.map(row => row[col]).filter(val => typeof val === 'number');
      const sum = values.reduce((acc, val) => acc + val, 0);
      const mean = sum / values.length;
      const sortedValues = [...values].sort((a, b) => a - b);
      const median = sortedValues[Math.floor(values.length / 2)];
      const min = Math.min(...values);
      const max = Math.max(...values);

      stats[col] = {
        mean: mean.toFixed(2),
        median: median.toFixed(2),
        min: min.toFixed(2),
        max: max.toFixed(2),
        count: values.length
      };
    });

    return stats;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        setData(jsonData);
        const cols = Object.keys(jsonData[0] || {});
        setColumns(cols);
        setStats(calculateStats(jsonData, cols));
        setSelectedColumn(cols.find(col => typeof jsonData[0][col] === 'number') || cols[0]);
      } catch (error) {
        console.error('Error al procesar el archivo:', error);
        alert('Error al procesar el archivo. Asegúrate de que sea un archivo Excel o CSV válido.');
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = useMemo(() => {
    return data.filter(row => 
      Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const chartData = useMemo(() => {
    if (!selectedColumn) return [];
    return data.slice(0, 20).map(row => ({
      name: row[columns[0]] || 'N/A',
      valor: Number(row[selectedColumn]) || 0
    }));
  }, [data, selectedColumn, columns]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Área de carga de archivos */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Analizador de Archivos Excel/CSV
              </Typography>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  },
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                component="label"
              >
                <input
                  type="file"
                  hidden
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                />
                <Upload style={{ width: 40, height: 40, color: '#666', marginBottom: 8 }} />
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Click para subir o arrastra y suelta
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Excel o CSV
                </Typography>
              </Box>
              {fileName && (
                <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
                  Archivo cargado: {fileName}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Filtros y Búsqueda */}
        {data.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Buscar en todos los campos"
                      variant="outlined"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Columna para gráfico</InputLabel>
                      <Select
                        value={selectedColumn}
                        label="Columna para gráfico"
                        onChange={(e) => setSelectedColumn(e.target.value)}
                      >
                        {columns.filter(col => 
                          data.some(row => typeof row[col] === 'number')
                        ).map((col) => (
                          <MenuItem key={col} value={col}>{col}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Gráfico */}
        {data.length > 0 && selectedColumn && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gráfico de {selectedColumn}
                </Typography>
                <Box sx={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="valor" fill="#8884d8" name={selectedColumn} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Estadísticas */}
        {stats && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Estadísticas Descriptivas
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Columna</TableCell>
                        <TableCell>Media</TableCell>
                        <TableCell>Mediana</TableCell>
                        <TableCell>Mínimo</TableCell>
                        <TableCell>Máximo</TableCell>
                        <TableCell>Cantidad</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(stats).map(([col, stat]) => (
                        <TableRow key={col}>
                          <TableCell component="th" scope="row">{col}</TableCell>
                          <TableCell>{stat.mean}</TableCell>
                          <TableCell>{stat.median}</TableCell>
                          <TableCell>{stat.min}</TableCell>
                          <TableCell>{stat.max}</TableCell>
                          <TableCell>{stat.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Tabla de datos */}
        {data.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Datos
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        {columns.map((col) => (
                          <TableCell key={col}>{col}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => (
                          <TableRow key={index}>
                            {columns.map((col) => (
                              <TableCell key={col}>{row[col]}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  component="div"
                  count={filteredData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Filas por página:"
                />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default FileAnalyzer;