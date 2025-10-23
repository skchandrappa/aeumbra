import React, { useState, FormEvent, ChangeEvent } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from '@mui/material';
import { Security, Business, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RegisterData } from '../types';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    user_type: 'consumer',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await register(formData);
      // Show success message and redirect to login
      alert('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      user_type: e.target.value as 'guard' | 'consumer',
    });
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%', maxWidth: 600 }}>
          <IconButton
            onClick={() => navigate('/')}
            sx={{ mr: 1 }}
            aria-label="back to home"
          >
            <ArrowBack />
          </IconButton>
          <Typography component="h1" variant="h4" align="center" sx={{ flex: 1 }}>
            Create Account
          </Typography>
        </Box>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Join Aeumbra Security Platform
        </Typography>

        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* User Type Selection */}
            <Typography variant="h6" gutterBottom>
              I want to join as:
            </Typography>
            <RadioGroup
              value={formData.user_type}
              onChange={handleUserTypeChange}
              sx={{ mb: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      border: formData.user_type === 'guard' ? '2px solid' : '1px solid',
                      borderColor: formData.user_type === 'guard' ? 'primary.main' : 'grey.300',
                      cursor: 'pointer',
                    }}
                    onClick={() => setFormData({ ...formData, user_type: 'guard' })}
                  >
                    <CardContent>
                      <FormControlLabel
                        value="guard"
                        control={<Radio />}
                        label=""
                        sx={{ width: '100%' }}
                      />
                      <Box textAlign="center">
                        <Security sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h6">Security Professional</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Offer security services and earn money
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      border: formData.user_type === 'consumer' ? '2px solid' : '1px solid',
                      borderColor: formData.user_type === 'consumer' ? 'primary.main' : 'grey.300',
                      cursor: 'pointer',
                    }}
                    onClick={() => setFormData({ ...formData, user_type: 'consumer' })}
                  >
                    <CardContent>
                      <FormControlLabel
                        value="consumer"
                        control={<Radio />}
                        label=""
                        sx={{ width: '100%' }}
                      />
                      <Box textAlign="center">
                        <Business sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h6">Business/Consumer</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Find security services for your needs
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </RadioGroup>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="first_name"
                  required
                  fullWidth
                  id="first_name"
                  label="First Name"
                  autoFocus
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  autoComplete="family-name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phone"
                  label="Phone Number"
                  type="tel"
                  id="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Box textAlign="center">
              <Button
                component="button"
                variant="text"
                onClick={() => navigate('/login')}
                sx={{ display: 'block', mb: 1 }}
              >
                Already have an account? Sign In
              </Button>
              <Button
                component="button"
                variant="text"
                onClick={() => navigate('/')}
                sx={{ textTransform: 'none', textDecoration: 'none' }}
              >
                ← Back to Home
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
