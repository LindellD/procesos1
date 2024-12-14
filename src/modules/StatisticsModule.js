import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import {
  BarChart2,
  LineChart as LineChartIcon,
  Upload
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Histogram
} from 'recharts';

const StatisticsModule = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [data, setData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [availableColumns, setAvailableColumns] = useState([]);
  const [stats, setStats] = useState(null);
  const [normalityTest, setNormalityTest] = useState(null);

  const calculateStats = (numbers) => {
    if (!numbers || numbers.length === 0) return null;
    
    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / numbers.length;
    
    // Mediana
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2 
      : sorted[mid];
    
    // Desviación estándar
    const squareDiffs = numbers.map(value => Math.pow(value - mean, 2));
    const variance = squareDiffs.reduce((a, b) => a + b, 0) / numbers.length;
    const stdDev = Math.sqrt(variance);
    
    // Cuartiles
    const q1 = sorted[Math.floor(sorted.length / 4)];
    const q3 = sorted[Math.floor((3 * sorted.length) / 4)];
    const iqr = q3 - q1;

    // Coeficiente de variación
    const cv = (stdDev / mean) * 100;

    // Valores atípicos
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    const outliers = numbers.filter(x => x < lowerBound || x > upperBound);

    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      mean: mean.toFixed(2),
      median: median.toFixed(2),
      mode: calculateMode(sorted).toFixed(2),
      stdDev: stdDev.toFixed(2),
      variance: variance.toFixed(2),
      q1: q1.toFixed(2),
      q3: q3.toFixed(2),
      iqr: iqr.toFixed(2),
      cv: cv.toFixed(2),
      n: numbers.length,
      outliers: outliers.length
    };
  };

  const calculateMode = (sorted) => {
    let modeMap = {};
    let maxCount = 0;
    let modes = [];

    sorted.forEach(num => {
      modeMap[num] = (modeMap[num] || 0) + 1;
      if (modeMap[num] > maxCount) {
        maxCount = modeMap[num];
        modes = [num];
      } else if (modeMap[num] === maxCount) {
        modes.push(num);
      }
    });

    return modes[0]; // Retorna el primer modo si hay varios
  };

  const checkNormality = (numbers) => {
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const stdDev = Math.sqrt(
      numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length
    );

    // Cálculo de asimetría
    const skewness = numbers.reduce((a, b) => 
      a + Math.pow((b - mean) / stdDev, 3), 0) / numbers.length;

    // Cálculo de curtosis
    const kurtosis = numbers.reduce((a, b) => 
      a + Math.pow((b - mean) / stdDev, 4), 0) / numbers.length - 3;

    // Test de Jarque-Bera simplificado
    const jb = numbers.length * (
      Math.pow(skewness, 2) / 6 + Math.pow(kurtosis, 2) / 24
    );

    return {
      isNormal: Math.abs(skewness) < 0.5 && Math.abs(kurtosis) < 0.5,
      skewness: skewness.toFixed(3),
      kurtosis: kurtosis.toFixed(3),
      jbStat: jb.toFixed(3)
    };
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
        setAvailableColumns(cols);
        if (cols.length > 0) setSelectedColumn(cols[0]);
      } catch (error) {
        console.error('Error al procesar el archivo:', error);
        alert('Error al procesar el archivo. Asegúrate de que sea un archivo Excel o CSV válido.');
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleColumnChange = (event) => {
    const column = event.target.value;
    setSelectedColumn(column);
    
    if (data && data.length > 0) {
      const numbers = data
        .map(row => Number(row[column]))
        .filter(val => !isNaN(val));
      
      setStats(calculateStats(numbers));
      setNormalityTest(checkNormality(numbers));
    }
  };

  const generateHistogramData = (numbers) => {
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const range = max - min;
    const binWidth = range / 20;
    
    const bins = Array.from({ length: 20 }, (_, i) => ({
      start: min + i * binWidth,
      end: min + (i + 1) * binWidth,
      count: 0
    }));

    numbers.forEach(num => {
      const binIndex = Math.min(
        Math.floor((num - min) / binWidth),
        bins.length - 1
      );
      bins[binIndex].count++;
    });

    return bins.map(bin => ({
      range: `${bin.start.toFixed(2)}-${bin.end.toFixed(2)}`,
      frequency: bin.count,
      midpoint: (bin.start + bin.end) / 2
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Estadísticas
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              mb: 3,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              }
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
            <Alert severity="success" sx={{ mb: 2 }}>
              Archivo cargado: {fileName}
            </Alert>
          )}

          {availableColumns.length > 0 && (
            <FormControl fullWidth>
              <InputLabel>Seleccionar Columna</InputLabel>
              <Select
                value={selectedColumn}
                label="Seleccionar Columna"
                onChange={handleColumnChange}
              >
                {availableColumns.map(col => (
                  <MenuItem key={col} value={col}>{col}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </CardContent>
      </Card>

      {stats && (
        <Grid container spacing={3}>
          {/* Estadísticas Descriptivas */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Estadísticas Descriptivas
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Media</Typography>
                    <Typography variant="h6">{stats.mean}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Mediana</Typography>
                    <Typography variant="h6">{stats.median}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Desv. Estándar</Typography>
                    <Typography variant="h6">{stats.stdDev}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Varianza</Typography>
                    <Typography variant="h6">{stats.variance}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Q1</Typography>
                    <Typography variant="h6">{stats.q1}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Q3</Typography>
                    <Typography variant="h6">{stats.q3}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Mínimo</Typography>
                    <Typography variant="h6">{stats.min}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Máximo</Typography>
                    <Typography variant="h6">{stats.max}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Test de Normalidad */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Test de Normalidad
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography color={normalityTest.isNormal ? 'success.main' : 'error.main'}>
                      Los datos {normalityTest.isNormal ? 'siguen' : 'no siguen'} una distribución normal
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Asimetría</Typography>
                    <Typography variant="h6">{normalityTest.skewness}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary">Curtosis</Typography>
                    <Typography variant="h6">{normalityTest.kurtosis}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráficos */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Visualización de Datos
                </Typography>
                {/* Histograma */}
                <Box sx={{ height: 400, mt: 2 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={generateHistogramData(
                        data.map(row => Number(row[selectedColumn]))
                          .filter(val => !isNaN(val))
                      )}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="frequency" fill="#8884d8" name="Frecuencia" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>

                {/* Gráfico de Línea de Tendencia */}
                <Box sx={{ height: 400, mt: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Tendencia
                  </Typography>
                  <ResponsiveContainer>
                    <LineChart
                      data={data.map((row, index) => ({
                        index: index + 1,
                        value: Number(row[selectedColumn])
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="index" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        name={selectedColumn}
                        dot
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default StatisticsModule;