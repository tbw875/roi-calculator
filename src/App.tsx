import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Card,
  CardContent,
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

interface CalculatorInputs {
  industry: string;
  monthlyVerifications: number;
  currentFraudRate: number;
  improvementRate: number;
  avgTransactionValue: number;
  currentCostPerVerification: number;
  ourCostPerVerification: number;
}

interface ROIResults {
  annualFraudSavings: number;
  annualComplianceSavings: number;
  annualOperationalSavings: number;
  totalAnnualSavings: number;
  annualCostIncrease: number;
  netAnnualROI: number;
  roiPercentage: number;
  paybackMonths: number;
}

const INDUSTRY_CONFIGS = {
  healthcare: {
    name: 'Healthcare',
    fraudLossMultiplier: 0.08, // 8% typical fraud loss rate
    complianceViolationCost: 1500000, // Average HIPAA violation cost
    breachCostPerRecord: 10.93, // Million per breach / typical records
    operationalEfficiencyGain: 0.15, // 15% efficiency gain
  },
  financial: {
    name: 'Financial Services',
    fraudLossMultiplier: 0.05, // 5% typical fraud loss rate
    complianceViolationCost: 2000000, // Average financial compliance violation
    breachCostPerRecord: 4.51, // Financial services breach cost
    operationalEfficiencyGain: 0.20, // 20% efficiency gain
  },
  general: {
    name: 'General Business',
    fraudLossMultiplier: 0.03, // 3% typical fraud loss rate
    complianceViolationCost: 500000, // General compliance violations
    breachCostPerRecord: 3.28, // General breach cost
    operationalEfficiencyGain: 0.10, // 10% efficiency gain
  },
};

function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    industry: 'healthcare',
    monthlyVerifications: 10000,
    currentFraudRate: 2.5,
    improvementRate: 75,
    avgTransactionValue: 500,
    currentCostPerVerification: 2.50,
    ourCostPerVerification: 3.00,
  });

  const results = useMemo((): ROIResults => {
    const config = INDUSTRY_CONFIGS[inputs.industry as keyof typeof INDUSTRY_CONFIGS];
    const annualVerifications = inputs.monthlyVerifications * 12;
    const annualTransactionVolume = annualVerifications * inputs.avgTransactionValue;

    // Calculate fraud savings
    const currentAnnualFraudLoss = annualTransactionVolume * (inputs.currentFraudRate / 100);
    const fraudReductionRate = inputs.improvementRate / 100;
    const annualFraudSavings = currentAnnualFraudLoss * fraudReductionRate;

    // Calculate compliance savings (probability-based)
    const violationProbability = Math.min(0.05, inputs.currentFraudRate / 100 * 2); // 2x fraud rate as violation risk
    const reducedViolationProbability = violationProbability * (1 - fraudReductionRate);
    const annualComplianceSavings = (violationProbability - reducedViolationProbability) * config.complianceViolationCost;

    // Calculate operational savings
    const annualOperationalSavings = annualVerifications * inputs.currentCostPerVerification * config.operationalEfficiencyGain;

    const totalAnnualSavings = annualFraudSavings + annualComplianceSavings + annualOperationalSavings;

    // Calculate cost increase
    const annualCostIncrease = annualVerifications * (inputs.ourCostPerVerification - inputs.currentCostPerVerification);

    const netAnnualROI = totalAnnualSavings - annualCostIncrease;
    const roiPercentage = annualCostIncrease > 0 ? (netAnnualROI / annualCostIncrease) * 100 : 0;
    const paybackMonths = annualCostIncrease > 0 ? (annualCostIncrease / (totalAnnualSavings / 12)) : 0;

    return {
      annualFraudSavings,
      annualComplianceSavings,
      annualOperationalSavings,
      totalAnnualSavings,
      annualCostIncrease,
      netAnnualROI,
      roiPercentage,
      paybackMonths,
    };
  }, [inputs]);

  const handleInputChange = (field: keyof CalculatorInputs, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const chartData = [
    { name: 'Fraud Prevention', value: results.annualFraudSavings, fill: '#8884d8' },
    { name: 'Compliance Savings', value: results.annualComplianceSavings, fill: '#82ca9d' },
    { name: 'Operational Efficiency', value: results.annualOperationalSavings, fill: '#ffc658' },
  ];

  const comparisonData = [
    {
      name: 'Current State',
      cost: inputs.monthlyVerifications * 12 * inputs.currentCostPerVerification,
      savings: 0,
    },
    {
      name: 'With Our Service',
      cost: inputs.monthlyVerifications * 12 * inputs.ourCostPerVerification,
      savings: results.totalAnnualSavings,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Identity Verification ROI Calculator
        </Typography>

        <Grid container spacing={3}>
          {/* Input Panel */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: 'fit-content' }}>
              <Typography variant="h5" gutterBottom>
                Configuration
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Industry</InputLabel>
                <Select
                  value={inputs.industry}
                  label="Industry"
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                >
                  {Object.entries(INDUSTRY_CONFIGS).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      {config.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Monthly Verifications"
                type="number"
                value={inputs.monthlyVerifications}
                onChange={(e) => handleInputChange('monthlyVerifications', parseInt(e.target.value) || 0)}
                sx={{ mb: 2 }}
                helperText="Number of identity verifications per month"
              />

              <TextField
                fullWidth
                label="Current Fraud Rate (%)"
                type="number"
                value={inputs.currentFraudRate}
                onChange={(e) => handleInputChange('currentFraudRate', parseFloat(e.target.value) || 0)}
                sx={{ mb: 2 }}
                helperText="Current percentage of fraudulent transactions"
                inputProps={{ step: 0.1, min: 0, max: 100 }}
              />

              <TextField
                fullWidth
                label="Our Improvement Rate (%)"
                type="number"
                value={inputs.improvementRate}
                onChange={(e) => handleInputChange('improvementRate', parseFloat(e.target.value) || 0)}
                sx={{ mb: 2 }}
                helperText="Percentage reduction in fraud with our service"
                inputProps={{ step: 1, min: 0, max: 100 }}
              />

              <TextField
                fullWidth
                label="Average Transaction Value ($)"
                type="number"
                value={inputs.avgTransactionValue}
                onChange={(e) => handleInputChange('avgTransactionValue', parseFloat(e.target.value) || 0)}
                sx={{ mb: 2 }}
                helperText="Average dollar value per transaction"
              />

              <TextField
                fullWidth
                label="Current Cost per Verification ($)"
                type="number"
                value={inputs.currentCostPerVerification}
                onChange={(e) => handleInputChange('currentCostPerVerification', parseFloat(e.target.value) || 0)}
                sx={{ mb: 2 }}
                helperText="Your current cost per identity verification"
                inputProps={{ step: 0.01, min: 0 }}
              />

              <TextField
                fullWidth
                label="Our Cost per Verification ($)"
                type="number"
                value={inputs.ourCostPerVerification}
                onChange={(e) => handleInputChange('ourCostPerVerification', parseFloat(e.target.value) || 0)}
                sx={{ mb: 2 }}
                helperText="Our service cost per identity verification"
                inputProps={{ step: 0.01, min: 0 }}
              />
            </Paper>
          </Grid>

          {/* Results Panel */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {/* Key Metrics Cards */}
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Net Annual ROI
                    </Typography>
                    <Typography variant="h4" component="div" color="primary">
                      {formatCurrency(results.netAnnualROI)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      ROI Percentage
                    </Typography>
                    <Typography variant="h4" component="div" color="secondary">
                      {results.roiPercentage.toFixed(0)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Payback Period
                    </Typography>
                    <Typography variant="h4" component="div">
                      {results.paybackMonths.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      months
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Savings
                    </Typography>
                    <Typography variant="h4" component="div" color="success.main">
                      {formatCurrency(results.totalAnnualSavings)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Savings Breakdown */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: 400 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Annual Savings Breakdown
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${formatCurrency(Number(value))}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Cost Comparison */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: 400 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Annual Cost vs Savings Comparison
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="cost" fill="#ff6b6b" name="Annual Cost" />
                        <Bar dataKey="savings" fill="#51cf66" name="Annual Savings" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Detailed Breakdown */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Detailed Financial Impact
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            <strong>Annual Savings</strong>
                          </Typography>
                          <Typography>Fraud Prevention: {formatCurrency(results.annualFraudSavings)}</Typography>
                          <Typography>Compliance Risk Reduction: {formatCurrency(results.annualComplianceSavings)}</Typography>
                          <Typography>Operational Efficiency: {formatCurrency(results.annualOperationalSavings)}</Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="subtitle2">
                            <strong>Total Savings: {formatCurrency(results.totalAnnualSavings)}</strong>
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            <strong>Investment</strong>
                          </Typography>
                          <Typography>Additional Annual Cost: {formatCurrency(results.annualCostIncrease)}</Typography>
                          <Typography>Monthly Investment: {formatCurrency(results.annualCostIncrease / 12)}</Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="subtitle2">
                            <strong>Net Annual ROI: {formatCurrency(results.netAnnualROI)}</strong>
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {results.roiPercentage > 200 && (
                      <Alert severity="success" sx={{ mt: 2 }}>
                        Excellent ROI! This represents a highly profitable investment in identity verification.
                      </Alert>
                    )}

                    {results.paybackMonths < 6 && (
                      <Alert severity="info" sx={{ mt: 1 }}>
                        Fast payback period - you'll see positive returns in under 6 months.
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;