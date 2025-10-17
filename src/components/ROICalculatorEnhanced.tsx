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
  Button,
  Tooltip,
  IconButton,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Slide,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import {
  Info,
  TrendingUp,
  Security,
  MonetizationOn,
  Download,
  Share,
  ExpandMore,
  Calculate,
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Green for positive ROI
    },
    secondary: {
      main: '#1565C0', // Blue for highlights
    },
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
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
  companySize: string;
  includeComplianceCosts: boolean;
  includeOperationalEfficiency: boolean;
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
  monthlyBenefit: number;
  threeYearROI: number;
  riskScore: number;
}

const INDUSTRY_CONFIGS = {
  healthcare: {
    name: 'Healthcare',
    icon: '🏥',
    description: 'Healthcare organizations face high fraud rates and strict HIPAA compliance requirements',
    fraudLossMultiplier: 0.08,
    complianceViolationCost: 1500000,
    breachCostPerRecord: 10.93,
    operationalEfficiencyGain: 0.15,
    riskMultiplier: 1.5,
  },
  financial: {
    name: 'Financial Services',
    icon: '🏦',
    description: 'Financial institutions require strict identity verification for AML/KYC compliance',
    fraudLossMultiplier: 0.05,
    complianceViolationCost: 2000000,
    breachCostPerRecord: 4.51,
    operationalEfficiencyGain: 0.20,
    riskMultiplier: 1.3,
  },
  fintech: {
    name: 'FinTech',
    icon: '💳',
    description: 'Digital financial services with high transaction volumes and fraud risk',
    fraudLossMultiplier: 0.07,
    complianceViolationCost: 1000000,
    breachCostPerRecord: 5.2,
    operationalEfficiencyGain: 0.25,
    riskMultiplier: 1.4,
  },
  ecommerce: {
    name: 'E-commerce',
    icon: '🛒',
    description: 'Online retailers facing payment fraud and account takeover attacks',
    fraudLossMultiplier: 0.04,
    complianceViolationCost: 500000,
    breachCostPerRecord: 3.28,
    operationalEfficiencyGain: 0.18,
    riskMultiplier: 1.2,
  },
  gaming: {
    name: 'Gaming & Entertainment',
    icon: '🎮',
    description: 'Gaming platforms combating account fraud and underage access',
    fraudLossMultiplier: 0.06,
    complianceViolationCost: 750000,
    breachCostPerRecord: 4.1,
    operationalEfficiencyGain: 0.22,
    riskMultiplier: 1.3,
  },
  general: {
    name: 'General Business',
    icon: '🏢',
    description: 'Other industries requiring identity verification services',
    fraudLossMultiplier: 0.03,
    complianceViolationCost: 500000,
    breachCostPerRecord: 3.28,
    operationalEfficiencyGain: 0.10,
    riskMultiplier: 1.0,
  },
};

const COMPANY_SIZE_MULTIPLIERS = {
  startup: { name: 'Startup (1-50 employees)', multiplier: 0.8 },
  small: { name: 'Small Business (51-200 employees)', multiplier: 1.0 },
  medium: { name: 'Medium Business (201-1000 employees)', multiplier: 1.2 },
  large: { name: 'Large Enterprise (1000+ employees)', multiplier: 1.5 },
};

function ROICalculatorEnhanced() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    industry: 'healthcare',
    monthlyVerifications: 10000,
    currentFraudRate: 2.5,
    improvementRate: 75,
    avgTransactionValue: 500,
    currentCostPerVerification: 2.50,
    ourCostPerVerification: 3.00,
    companySize: 'medium',
    includeComplianceCosts: true,
    includeOperationalEfficiency: true,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

  React.useEffect(() => {
    setAnimateCards(true);
  }, []);

  const results = useMemo((): ROIResults => {
    const config = INDUSTRY_CONFIGS[inputs.industry as keyof typeof INDUSTRY_CONFIGS];
    const sizeMultiplier = COMPANY_SIZE_MULTIPLIERS[inputs.companySize as keyof typeof COMPANY_SIZE_MULTIPLIERS].multiplier;
    const annualVerifications = inputs.monthlyVerifications * 12;
    const annualTransactionVolume = annualVerifications * inputs.avgTransactionValue;

    // Calculate fraud savings
    const currentAnnualFraudLoss = annualTransactionVolume * (inputs.currentFraudRate / 100);
    const fraudReductionRate = inputs.improvementRate / 100;
    const annualFraudSavings = currentAnnualFraudLoss * fraudReductionRate * sizeMultiplier;

    // Calculate compliance savings (if enabled)
    const violationProbability = Math.min(0.05, inputs.currentFraudRate / 100 * 2);
    const reducedViolationProbability = violationProbability * (1 - fraudReductionRate);
    const annualComplianceSavings = inputs.includeComplianceCosts
      ? (violationProbability - reducedViolationProbability) * config.complianceViolationCost * sizeMultiplier
      : 0;

    // Calculate operational savings (if enabled)
    const annualOperationalSavings = inputs.includeOperationalEfficiency
      ? annualVerifications * inputs.currentCostPerVerification * config.operationalEfficiencyGain * sizeMultiplier
      : 0;

    const totalAnnualSavings = annualFraudSavings + annualComplianceSavings + annualOperationalSavings;

    // Calculate cost increase
    const annualCostIncrease = annualVerifications * (inputs.ourCostPerVerification - inputs.currentCostPerVerification);

    const netAnnualROI = totalAnnualSavings - annualCostIncrease;
    const roiPercentage = annualCostIncrease > 0 ? (netAnnualROI / annualCostIncrease) * 100 : 0;
    const paybackMonths = annualCostIncrease > 0 ? (annualCostIncrease / (totalAnnualSavings / 12)) : 0;
    const monthlyBenefit = totalAnnualSavings / 12;
    const threeYearROI = netAnnualROI * 3;

    // Calculate risk score (lower is better)
    const riskScore = Math.max(0, Math.min(100,
      (inputs.currentFraudRate * config.riskMultiplier) +
      (paybackMonths > 12 ? 20 : 0) +
      (roiPercentage < 100 ? 15 : 0)
    ));

    return {
      annualFraudSavings,
      annualComplianceSavings,
      annualOperationalSavings,
      totalAnnualSavings,
      annualCostIncrease,
      netAnnualROI,
      roiPercentage,
      paybackMonths,
      monthlyBenefit,
      threeYearROI,
      riskScore,
    };
  }, [inputs]);

  const handleInputChange = (field: keyof CalculatorInputs, value: string | number | boolean) => {
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

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  const chartData = [
    { name: 'Fraud Prevention', value: results.annualFraudSavings, fill: '#4CAF50' },
    { name: 'Compliance Savings', value: results.annualComplianceSavings, fill: '#2196F3' },
    { name: 'Operational Efficiency', value: results.annualOperationalSavings, fill: '#FF9800' },
  ].filter(item => item.value > 0);

  const monthlyProjectionData = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    cumulativeSavings: results.monthlyBenefit * (i + 1),
    cumulativeInvestment: (results.annualCostIncrease / 12) * (i + 1),
    netBenefit: (results.monthlyBenefit * (i + 1)) - ((results.annualCostIncrease / 12) * (i + 1)),
  }));

  const currentConfig = INDUSTRY_CONFIGS[inputs.industry as keyof typeof INDUSTRY_CONFIGS];

  const exportResults = () => {
    const data = {
      inputs,
      results,
      generatedDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roi-calculator-results-${Date.now()}.json`;
    a.click();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            🔐 Identity Verification ROI Calculator
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
            Calculate the financial impact of enhanced identity verification for your business
          </Typography>
          <Chip
            label={`${currentConfig.icon} ${currentConfig.name}`}
            color="primary"
            size="large"
            sx={{ mb: 2 }}
          />
          <Typography variant="body1" color="textSecondary">
            {currentConfig.description}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Enhanced Input Panel */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: 'fit-content', position: 'sticky', top: 20 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calculate />
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{config.icon}</span>
                        {config.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Company Size</InputLabel>
                <Select
                  value={inputs.companySize}
                  label="Company Size"
                  onChange={(e) => handleInputChange('companySize', e.target.value)}
                >
                  {Object.entries(COMPANY_SIZE_MULTIPLIERS).map(([key, config]) => (
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
                InputProps={{
                  endAdornment: <Tooltip title="This affects the scale of all calculations"><IconButton size="small"><Info /></IconButton></Tooltip>
                }}
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

              <Accordion expanded={showAdvanced} onChange={() => setShowAdvanced(!showAdvanced)}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Advanced Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
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

                  <FormControlLabel
                    control={
                      <Switch
                        checked={inputs.includeComplianceCosts}
                        onChange={(e) => handleInputChange('includeComplianceCosts', e.target.checked)}
                      />
                    }
                    label="Include Compliance Cost Savings"
                    sx={{ mb: 1, display: 'block' }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={inputs.includeOperationalEfficiency}
                        onChange={(e) => handleInputChange('includeOperationalEfficiency', e.target.checked)}
                      />
                    }
                    label="Include Operational Efficiency Gains"
                    sx={{ mb: 1, display: 'block' }}
                  />
                </AccordionDetails>
              </Accordion>

              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button variant="outlined" onClick={exportResults} startIcon={<Download />} size="small">
                  Export
                </Button>
                <Button variant="outlined" startIcon={<Share />} size="small">
                  Share
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Enhanced Results Panel */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {/* Key Metrics Cards with Animation */}
              {[
                {
                  title: 'Net Annual ROI',
                  value: formatCurrency(results.netAnnualROI),
                  color: results.netAnnualROI > 0 ? 'success.main' : 'error.main',
                  icon: <MonetizationOn />,
                  subtitle: `${formatPercent(results.roiPercentage)} return`
                },
                {
                  title: 'Payback Period',
                  value: `${results.paybackMonths.toFixed(1)} months`,
                  color: results.paybackMonths < 12 ? 'success.main' : 'warning.main',
                  icon: <TrendingUp />,
                  subtitle: 'Time to break even'
                },
                {
                  title: 'Risk Reduction',
                  value: `${(100 - results.riskScore).toFixed(0)}%`,
                  color: 'primary.main',
                  icon: <Security />,
                  subtitle: 'Lower fraud exposure'
                },
                {
                  title: '3-Year Value',
                  value: formatCurrency(results.threeYearROI),
                  color: 'secondary.main',
                  icon: <TrendingUp />,
                  subtitle: 'Total 3-year benefit'
                },
              ].map((metric, index) => (
                <Grid item xs={12} sm={6} md={3} key={metric.title}>
                  <Slide direction="up" in={animateCards} timeout={300 + index * 100}>
                    <Card sx={{
                      height: '100%',
                      background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-4px)' }
                    }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ color: metric.color, mr: 1 }}>
                            {metric.icon}
                          </Box>
                          <Typography color="textSecondary" variant="body2">
                            {metric.title}
                          </Typography>
                        </Box>
                        <Typography variant="h4" component="div" sx={{ color: metric.color, fontWeight: 'bold' }}>
                          {metric.value}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {metric.subtitle}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Slide>
                </Grid>
              ))}

              {/* Monthly Projection Chart */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📈 12-Month Financial Projection
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={monthlyProjectionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                        <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Area type="monotone" dataKey="cumulativeSavings" stackId="1" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.3} name="Cumulative Savings" />
                        <Area type="monotone" dataKey="cumulativeInvestment" stackId="2" stroke="#f44336" fill="#f44336" fillOpacity={0.3} name="Cumulative Investment" />
                        <Line type="monotone" dataKey="netBenefit" stroke="#2196F3" strokeWidth={3} name="Net Benefit" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* Savings Breakdown */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: 400 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      💰 Annual Savings Breakdown
                    </Typography>
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                        <Typography color="textSecondary">No savings data to display</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Risk Assessment */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: 400 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      🛡️ Risk Assessment
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Current Risk Level
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={results.riskScore}
                        sx={{
                          height: 20,
                          borderRadius: 10,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: results.riskScore > 60 ? '#f44336' : results.riskScore > 30 ? '#ff9800' : '#4caf50'
                          }
                        }}
                      />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {results.riskScore > 60 ? 'High Risk' : results.riskScore > 30 ? 'Medium Risk' : 'Low Risk'} ({results.riskScore.toFixed(0)}/100)
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" gutterBottom>
                      Risk Factors:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip
                        label={`${inputs.currentFraudRate}% Current Fraud Rate`}
                        size="small"
                        color={inputs.currentFraudRate > 5 ? 'error' : inputs.currentFraudRate > 2 ? 'warning' : 'success'}
                      />
                      <Chip
                        label={`${currentConfig.name} Industry`}
                        size="small"
                        color="info"
                      />
                      <Chip
                        label={`${formatCurrency(inputs.avgTransactionValue)} Avg Transaction`}
                        size="small"
                        color={inputs.avgTransactionValue > 1000 ? 'warning' : 'default'}
                      />
                    </Box>

                    <Box sx={{ mt: 2, p: 2, backgroundColor: 'success.light', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        After Implementation:
                      </Typography>
                      <Typography variant="body2">
                        • {formatPercent(inputs.improvementRate)} fraud reduction
                      </Typography>
                      <Typography variant="body2">
                        • {formatCurrency(results.annualFraudSavings)} annual fraud savings
                      </Typography>
                      <Typography variant="body2">
                        • {formatCurrency(results.monthlyBenefit)} monthly benefit
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Executive Summary */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📊 Executive Summary
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Investment Analysis
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>Annual Investment:</strong> {formatCurrency(results.annualCostIncrease)}
                          ({formatCurrency(results.annualCostIncrease / 12)}/month)
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>Annual Return:</strong> {formatCurrency(results.totalAnnualSavings)}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>Net Annual Benefit:</strong> {formatCurrency(results.netAnnualROI)}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          <strong>ROI:</strong> {formatPercent(results.roiPercentage)} annually
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Business Impact
                        </Typography>
                        <Typography variant="body2" paragraph>
                          • <strong>Fraud Reduction:</strong> {formatPercent(inputs.improvementRate)} improvement
                        </Typography>
                        <Typography variant="body2" paragraph>
                          • <strong>Monthly Savings:</strong> {formatCurrency(results.monthlyBenefit)}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          • <strong>Payback Period:</strong> {results.paybackMonths.toFixed(1)} months
                        </Typography>
                        <Typography variant="body2" paragraph>
                          • <strong>3-Year Value:</strong> {formatCurrency(results.threeYearROI)}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Dynamic Alerts */}
                    {results.roiPercentage > 300 && (
                      <Alert severity="success" sx={{ mt: 2 }}>
                        <strong>Outstanding ROI!</strong> This investment shows exceptional returns of {formatPercent(results.roiPercentage)} annually.
                      </Alert>
                    )}

                    {results.paybackMonths < 6 && (
                      <Alert severity="info" sx={{ mt: 1 }}>
                        <strong>Fast Payback:</strong> You'll see positive returns in under 6 months with a payback period of {results.paybackMonths.toFixed(1)} months.
                      </Alert>
                    )}

                    {results.annualFraudSavings > 1000000 && (
                      <Alert severity="warning" sx={{ mt: 1 }}>
                        <strong>High Fraud Risk:</strong> Your current fraud exposure is over $1M annually. Immediate action recommended.
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

export default ROICalculatorEnhanced;