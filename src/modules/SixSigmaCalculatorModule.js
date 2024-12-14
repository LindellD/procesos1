import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Calculator,
  ChevronRight,
  BarChart2,
  Settings2
} from 'lucide-react';

const SixSigmaCalculatorModule = () => {
  const [calculationType, setCalculationType] = useState('dpmo');
  const [inputs, setInputs] = useState({
    defects: '',
    opportunities: '',
    units: '',
    mean: '',
    standardDev: '',
    lsl: '',
    usl: '',
    target: ''
  });
  const [results, setResults] = useState(null);

  const calculateDPMO = () => {
    const { defects, opportunities, units } = inputs;
    const dpu = defects / units;
    const dpmo = (defects / (opportunities * units)) * 1000000;
    const processYield = (1 - dpu) * 100;  // Cambiado 'yield' por 'processYield'
    const sigmaLevel = 0.8406 + Math.sqrt(29.37 - 2.221 * Math.log(dpmo));

    setResults({
      dpmo: dpmo.toFixed(2),
      dpu: dpu.toFixed(4),
      processYield: processYield.toFixed(2),  // Actualizado aquí también
      sigmaLevel: sigmaLevel.toFixed(2)
    });
  };

  const calculateProcessCapability = () => {
    const { mean, standardDev, lsl, usl, target } = inputs;
    const cp = (usl - lsl) / (6 * standardDev);
    const cpu = (usl - mean) / (3 * standardDev);
    const cpl = (mean - lsl) / (3 * standardDev);
    const cpk = Math.min(cpu, cpl);
    const pp = (usl - lsl) / (6 * standardDev);
    
    setResults({
      cp: cp.toFixed(3),
      cpu: cpu.toFixed(3),
      cpl: cpl.toFixed(3),
      cpk: cpk.toFixed(3),
      pp: pp.toFixed(3)
    });
  };

  const handleCalculate = () => {
    if (calculationType === 'dpmo') {
      calculateDPMO();
    } else {
      calculateProcessCapability();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Calculadora Six Sigma
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Calculator style={{ verticalAlign: 'middle', marginRight: 8 }}/>
                Configuración
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Tipo de Cálculo</InputLabel>
                <Select
                  value={calculationType}
                  label="Tipo de Cálculo"
                  onChange={(e) => setCalculationType(e.target.value)}
                >
                  <MenuItem value="dpmo">DPMO y Nivel Sigma</MenuItem>
                  <MenuItem value="capability">Capacidad del Proceso</MenuItem>
                </Select>
              </FormControl>

              {calculationType === 'dpmo' ? (
                <>
                  <TextField
                    fullWidth
                    label="Número de Defectos"
                    name="defects"
                    type="number"
                    value={inputs.defects}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Oportunidades por Unidad"
                    name="opportunities"
                    type="number"
                    value={inputs.opportunities}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Unidades Inspeccionadas"
                    name="units"
                    type="number"
                    value={inputs.units}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </>
              ) : (
                <>
                  <TextField
                    fullWidth
                    label="Media del Proceso"
                    name="mean"
                    type="number"
                    value={inputs.mean}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Desviación Estándar"
                    name="standardDev"
                    type="number"
                    value={inputs.standardDev}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Límite Superior de Especificación (USL)"
                    name="usl"
                    type="number"
                    value={inputs.usl}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Límite Inferior de Especificación (LSL)"
                    name="lsl"
                    type="number"
                    value={inputs.lsl}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Valor Objetivo"
                    name="target"
                    type="number"
                    value={inputs.target}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={handleCalculate}
                startIcon={<ChevronRight />}
              >
                Calcular
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <BarChart2 style={{ verticalAlign: 'middle', marginRight: 8 }}/>
                Resultados
              </Typography>

              {results && (
                <Grid container spacing={2}>
                  {calculationType === 'dpmo' ? (
                    <>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" color="textSecondary">
                            DPMO
                          </Typography>
                          <Typography variant="h6">
                            {results.dpmo}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" color="textSecondary">
                            Nivel Sigma
                          </Typography>
                          <Typography variant="h6">
                            {results.sigmaLevel}σ
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" color="textSecondary">
                            DPU
                          </Typography>
                          <Typography variant="h6">
                            {results.dpu}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" color="textSecondary">
                            Rendimiento
                          </Typography>
                          <Typography variant="h6">
                            {results.processYield}%
                          </Typography>
                        </Paper>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" color="textSecondary">
                            Cp
                          </Typography>
                          <Typography variant="h6">
                            {results.cp}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" color="textSecondary">
                            Cpk
                          </Typography>
                          <Typography variant="h6">
                            {results.cpk}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" color="textSecondary">
                            Pp
                          </Typography>
                          <Typography variant="h6">
                            {results.pp}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" color="textSecondary">
                            CPU/CPL
                          </Typography>
                          <Typography variant="h6">
                            {results.cpu}/{results.cpl}
                          </Typography>
                        </Paper>
                      </Grid>
                    </>
                  )}
                </Grid>
              )}

              {!results && (
                <Typography color="textSecondary" align="center">
                  Ingresa los datos y presiona calcular para ver los resultados
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SixSigmaCalculatorModule;