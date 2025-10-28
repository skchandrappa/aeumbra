import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  // Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  // Cancel,
  TrendingUp,
  LocationOn,
  // Security,
} from '@mui/icons-material';
import Layout from '../components/Layout';

interface PricingZone {
  id: string;
  name: string;
  baseRate: number;
  peakMultiplier: number;
  weekendMultiplier: number;
  holidayMultiplier: number;
  isActive: boolean;
}

interface PricingFactor {
  id: string;
  name: string;
  multiplier: number;
  description: string;
  isActive: boolean;
}

const AdminPricingPage: React.FC = () => {
  const [pricingZones, setPricingZones] = useState<PricingZone[]>([
    {
      id: '1',
      name: 'Downtown',
      baseRate: 40,
      peakMultiplier: 1.5,
      weekendMultiplier: 1.2,
      holidayMultiplier: 2.0,
      isActive: true,
    },
    {
      id: '2',
      name: 'Suburbs',
      baseRate: 35,
      peakMultiplier: 1.3,
      weekendMultiplier: 1.1,
      holidayMultiplier: 1.8,
      isActive: true,
    },
    {
      id: '3',
      name: 'Rural Areas',
      baseRate: 30,
      peakMultiplier: 1.2,
      weekendMultiplier: 1.0,
      holidayMultiplier: 1.5,
      isActive: false,
    },
  ]);

  const [pricingFactors, setPricingFactors] = useState<PricingFactor[]>([
    {
      id: '1',
      name: 'VIP Protection',
      multiplier: 2.0,
      description: 'High-profile client protection',
      isActive: true,
    },
    {
      id: '2',
      name: 'Event Security',
      multiplier: 1.3,
      description: 'Large event crowd control',
      isActive: true,
    },
    {
      id: '3',
      name: 'Night Shift',
      multiplier: 1.4,
      description: 'Overnight security services',
      isActive: true,
    },
    {
      id: '4',
      name: 'Emergency Response',
      multiplier: 1.8,
      description: 'Short notice emergency services',
      isActive: true,
    },
  ]);

  const [editingZone, setEditingZone] = useState<PricingZone | null>(null);
  const [editingFactor, setEditingFactor] = useState<PricingFactor | null>(null);
  const [zoneDialogOpen, setZoneDialogOpen] = useState(false);
  const [factorDialogOpen, setFactorDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSaveZone = async (zone: PricingZone) => {
    setIsLoading(true);
    try {
      // In real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingZone) {
        setPricingZones(pricingZones.map(z => z.id === zone.id ? zone : z));
      } else {
        setPricingZones([...pricingZones, { ...zone, id: Date.now().toString() }]);
      }
      
      setZoneDialogOpen(false);
      setEditingZone(null);
      setSaveMessage('Pricing zone saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving pricing zone:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFactor = async (factor: PricingFactor) => {
    setIsLoading(true);
    try {
      // In real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingFactor) {
        setPricingFactors(pricingFactors.map(f => f.id === factor.id ? factor : f));
      } else {
        setPricingFactors([...pricingFactors, { ...factor, id: Date.now().toString() }]);
      }
      
      setFactorDialogOpen(false);
      setEditingFactor(null);
      setSaveMessage('Pricing factor saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving pricing factor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteZone = (zoneId: string) => {
    setPricingZones(pricingZones.filter(z => z.id !== zoneId));
  };

  const handleDeleteFactor = (factorId: string) => {
    setPricingFactors(pricingFactors.filter(f => f.id !== factorId));
  };

  const openZoneDialog = (zone?: PricingZone) => {
    setEditingZone(zone || null);
    setZoneDialogOpen(true);
  };

  const openFactorDialog = (factor?: PricingFactor) => {
    setEditingFactor(factor || null);
    setFactorDialogOpen(true);
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Pricing Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage pricing zones and factors for security services
        </Typography>

        {saveMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {saveMessage}
          </Alert>
        )}

        {/* Pricing Zones */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6">
                <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                Pricing Zones
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => openZoneDialog()}
              >
                Add Zone
              </Button>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Zone Name</TableCell>
                    <TableCell align="right">Base Rate ($/hr)</TableCell>
                    <TableCell align="right">Peak Multiplier</TableCell>
                    <TableCell align="right">Weekend Multiplier</TableCell>
                    <TableCell align="right">Holiday Multiplier</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pricingZones.map((zone) => (
                    <TableRow key={zone.id}>
                      <TableCell>{zone.name}</TableCell>
                      <TableCell align="right">${zone.baseRate}</TableCell>
                      <TableCell align="right">{zone.peakMultiplier}x</TableCell>
                      <TableCell align="right">{zone.weekendMultiplier}x</TableCell>
                      <TableCell align="right">{zone.holidayMultiplier}x</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={zone.isActive ? 'Active' : 'Inactive'}
                          color={zone.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => openZoneDialog(zone)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteZone(zone.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Pricing Factors */}
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h6">
                <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                Pricing Factors
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => openFactorDialog()}
              >
                Add Factor
              </Button>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Factor Name</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Multiplier</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pricingFactors.map((factor) => (
                    <TableRow key={factor.id}>
                      <TableCell>{factor.name}</TableCell>
                      <TableCell>{factor.description}</TableCell>
                      <TableCell align="right">{factor.multiplier}x</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={factor.isActive ? 'Active' : 'Inactive'}
                          color={factor.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => openFactorDialog(factor)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteFactor(factor.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Zone Dialog */}
        <Dialog open={zoneDialogOpen} onClose={() => setZoneDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingZone ? 'Edit Pricing Zone' : 'Add New Pricing Zone'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Zone Name"
                  value={editingZone?.name || ''}
                  onChange={(e) => setEditingZone({ ...editingZone!, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Base Rate ($/hr)"
                  type="number"
                  value={editingZone?.baseRate || 0}
                  onChange={(e) => setEditingZone({ ...editingZone!, baseRate: parseFloat(e.target.value) || 0 })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Peak Multiplier"
                  type="number"
                  inputProps={{ step: "0.1" }}
                  value={editingZone?.peakMultiplier || 1}
                  onChange={(e) => setEditingZone({ ...editingZone!, peakMultiplier: parseFloat(e.target.value) || 1 })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weekend Multiplier"
                  type="number"
                  inputProps={{ step: "0.1" }}
                  value={editingZone?.weekendMultiplier || 1}
                  onChange={(e) => setEditingZone({ ...editingZone!, weekendMultiplier: parseFloat(e.target.value) || 1 })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Holiday Multiplier"
                  type="number"
                  inputProps={{ step: "0.1" }}
                  value={editingZone?.holidayMultiplier || 1}
                  onChange={(e) => setEditingZone({ ...editingZone!, holidayMultiplier: parseFloat(e.target.value) || 1 })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editingZone?.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setEditingZone({ ...editingZone!, isActive: e.target.value === 'active' })}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setZoneDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => handleSaveZone(editingZone!)}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : <Save />}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Factor Dialog */}
        <Dialog open={factorDialogOpen} onClose={() => setFactorDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingFactor ? 'Edit Pricing Factor' : 'Add New Pricing Factor'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Factor Name"
                  value={editingFactor?.name || ''}
                  onChange={(e) => setEditingFactor({ ...editingFactor!, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={editingFactor?.description || ''}
                  onChange={(e) => setEditingFactor({ ...editingFactor!, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Multiplier"
                  type="number"
                  inputProps={{ step: "0.1" }}
                  value={editingFactor?.multiplier || 1}
                  onChange={(e) => setEditingFactor({ ...editingFactor!, multiplier: parseFloat(e.target.value) || 1 })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editingFactor?.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setEditingFactor({ ...editingFactor!, isActive: e.target.value === 'active' })}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFactorDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => handleSaveFactor(editingFactor!)}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={16} /> : <Save />}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default AdminPricingPage;
