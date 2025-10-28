import React, { useState, FormEvent, ChangeEvent } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  // CardMedia,
  Paper,
  Tabs,
  Tab,
  Chip,
  Stack,
  Avatar,
  IconButton,
  Divider,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Security,
  Shield,
  LocalPolice,
  VerifiedUser,
  Star,
  ArrowForward,
  Phone,
  Email,
  LocationOn,
  CheckCircle,
  // Schedule,
  People,
  // TrendingUp,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(loginData.email, loginData.password);
      navigate('/feed');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const services = [
    {
      title: 'For Security Guards',
      description: 'Find security gigs that match your skills, schedule, and location. Work when you want, where you want.',
      icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: ['Flexible Schedule', 'Instant Bookings', 'Competitive Pay', 'Skill Matching']
    },
    {
      title: 'For Clients',
      description: 'Book verified security professionals instantly. AI-powered matching ensures the right guard for your needs.',
      icon: <Shield sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: ['Instant Booking', 'AI Matching', 'Verified Guards', 'Real-time Tracking']
    },
    {
      title: 'Social Feed',
      description: 'Connect with the security community. Share experiences, get advice, and build professional networks.',
      icon: <VerifiedUser sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: ['Community Posts', 'Professional Network', 'Experience Sharing', 'Industry Updates']
    },
    {
      title: 'AI-Powered Matching',
      description: 'Advanced AI analyzes gig requirements and guard profiles to ensure perfect matches every time.',
      icon: <LocalPolice sx={{ fontSize: 40, color: 'primary.main' }} />,
      features: ['Smart Matching', 'Risk Assessment', 'Performance Analytics', 'Predictive Insights']
    }
  ];

  const stats = [
    { number: '2,500+', label: 'Active Security Guards' },
    { number: '15,000+', label: 'Completed Gigs' },
    { number: '98.5%', label: 'Match Success Rate' },
    { number: '24/7', label: 'Instant Booking' }
  ];

  const testimonials = [
    {
      name: 'Marcus Johnson',
      role: 'Security Guard',
      company: 'Independent Contractor',
      content: 'Aeumbre has changed my life. I can pick my own hours, choose gigs that match my skills, and earn more than traditional security jobs.',
      rating: 5
    },
    {
      name: 'Sarah Chen',
      role: 'Event Manager',
      company: 'Premier Events',
      content: 'The AI matching is incredible! It found the perfect security guard for our event in minutes. The feed feature keeps me connected to the community.',
      rating: 5
    },
    {
      name: 'David Rodriguez',
      role: 'Security Guard',
      company: 'Freelancer',
      content: 'The instant booking feature means I never have to wait for work. The social feed helps me learn from other guards and stay updated.',
      rating: 5
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `
            linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(51, 51, 51, 0.8) 100%),
            url('/security-shadow.svg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          py: { xs: 6, md: 12 },
          textAlign: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(51, 51, 51, 0.7) 100%)',
            zIndex: 1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
            <Box
              component="img"
              src="/aeumbra1.png"
              alt="Aeumbre"
              sx={{
                width: '100%',
                maxWidth: 400,
                height: 120,
                objectFit: 'contain',
                borderRadius: 1
              }}
            />
          </Box>

          <Typography variant="h2" component="h1" sx={{ 
            mb: 3, 
            fontWeight: 700,
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            fontSize: { xs: '2.5rem', md: '3.5rem' }
          }}>
            The Uber for Security Guards
          </Typography>
          
          <Typography variant="h5" sx={{ 
            mb: 4, 
            opacity: 0.95, 
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            maxWidth: '800px',
            mx: 'auto'
          }}>
            Connect instantly with verified security professionals. Book security services on-demand, 
            or find security gigs that match your skills and schedule.
          </Typography>

          <Typography variant="h6" sx={{ 
            mb: 6, 
            opacity: 0.9, 
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)', 
            fontStyle: 'italic',
            fontSize: { xs: '1rem', md: '1.2rem' }
          }}>
            "Always Present, Always Protecting" - Your security guard as a protective shadow
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 6 }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'secondary.main',
                color: 'white',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.4)',
                },
                transition: 'all 0.3s ease',
              }}
              onClick={handleRegisterRedirect}
              endIcon={<ArrowForward />}
            >
              Get Started Today
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Stack>

          {/* Stats */}
          <Grid container spacing={4} sx={{ mt: 8 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <Typography variant="h3" sx={{ 
                    fontWeight: 'bold', 
                    color: 'secondary.main',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                  }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    opacity: 0.9,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                  }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Login/Register Section */}
      <Box sx={{ py: 8, backgroundColor: 'grey.50' }}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" textAlign="center" gutterBottom sx={{ mb: 4 }}>
              Access Your Account
            </Typography>
            
            <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 3 }}>
              <Tab label="Sign In" />
              <Tab label="Get Started" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={handleLogin}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Security color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleRegisterRedirect}
                  sx={{ mb: 1 }}
                >
                  Don't have an account? Create One
                </Button>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box textAlign="center">
                <Typography variant="h6" gutterBottom>
                  Ready to get started?
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Join our platform as a security professional or find security services
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleRegisterRedirect}
                  sx={{ px: 4, py: 1.5 }}
                  endIcon={<ArrowForward />}
                >
                  Create Account
                </Button>
              </Box>
            </TabPanel>
          </Paper>
        </Container>
      </Box>

      {/* Key Features Section */}
      <Box sx={{ py: 8, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Why Choose Aeumbre?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
              The only platform that combines social networking, instant bookings, and AI-powered matching for the security industry
            </Typography>
          </Box>

          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                  For Security Guards
                </Typography>
                <Stack spacing={3} sx={{ mt: 3 }}>
                  <Box display="flex" alignItems="flex-start">
                    <CheckCircle sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Flexible Work Schedule
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Choose your own hours and work when it suits you. No more rigid schedules or mandatory shifts.
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="flex-start">
                    <CheckCircle sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Higher Earnings
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Earn 30-50% more than traditional security jobs with our competitive gig-based pricing.
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="flex-start">
                    <CheckCircle sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Skill-Based Matching
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        AI matches you with gigs that align with your expertise and experience level.
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="flex-start">
                    <CheckCircle sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Professional Network
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Connect with other guards, share experiences, and learn from the community through our social feed.
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                  For Clients
                </Typography>
                <Stack spacing={3} sx={{ mt: 3 }}>
                  <Box display="flex" alignItems="flex-start">
                    <CheckCircle sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Instant Booking
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Book verified security guards in minutes, not days. Available 24/7 for urgent security needs.
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="flex-start">
                    <CheckCircle sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        AI-Powered Matching
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Our AI analyzes your requirements and finds the perfect guard based on skills, location, and availability.
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="flex-start">
                    <CheckCircle sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Real-Time Tracking
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Monitor your security guard's location and status in real-time through our mobile app.
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="flex-start">
                    <CheckCircle sx={{ color: 'success.main', mr: 2, mt: 0.5 }} />
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Verified Professionals
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        All guards are background-checked, licensed, and rated by previous clients for your peace of mind.
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
            How Aeumbre Works
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
            The Uber-like platform connecting security guards with clients through AI-powered matching and instant bookings
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                    {service.icon}
                    <Typography variant="h5" component="h3" sx={{ ml: 2, fontWeight: 600 }}>
                      {service.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {service.description}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {service.features.map((feature, idx) => (
                      <Chip 
                        key={idx} 
                        label={feature} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, backgroundColor: 'grey.50' }}>
        <Container maxWidth="lg">
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
            What Our Community Says
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Trusted by security guards and clients across the industry
          </Typography>
        </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: 'warning.main', fontSize: 20 }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                      "{testimonial.content}"
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {testimonial.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}, {testimonial.company}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, backgroundColor: 'primary.main', color: 'white' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Ready to Join the Security Revolution?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of security guards and clients who trust Aeumbre for flexible, AI-powered security solutions
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
              onClick={handleRegisterRedirect}
              endIcon={<ArrowForward />}
            >
              Get Started Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
              startIcon={<Phone />}
            >
              Call Us Today
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, backgroundColor: 'grey.900', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  component="img"
                  src="/aeumbra1.png"
                  alt="Aeumbre"
                  sx={{
                    height: 40,
                    objectFit: 'contain',
                    mr: 2
                  }}
                />
                <Typography variant="h6" fontWeight="bold">
                  Aeumbre
                </Typography>
              </Box>
              <Typography variant="body2" color="grey.400" sx={{ mb: 2 }}>
                The Uber for security guards. Connect, book, and work with AI-powered matching and instant bookings.
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom>
                Services
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="grey.400">Instant Booking</Typography>
                <Typography variant="body2" color="grey.400">AI Matching</Typography>
                <Typography variant="body2" color="grey.400">Social Feed</Typography>
                <Typography variant="body2" color="grey.400">Flexible Work</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom>
                Company
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2" color="grey.400">For Guards</Typography>
                <Typography variant="body2" color="grey.400">For Clients</Typography>
                <Typography variant="body2" color="grey.400">How It Works</Typography>
                <Typography variant="body2" color="grey.400">Support</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Contact Info
              </Typography>
              <Stack spacing={1}>
                <Box display="flex" alignItems="center">
                  <Phone sx={{ fontSize: 16, mr: 1, color: 'grey.400' }} />
                  <Typography variant="body2" color="grey.400">+1 (555) 123-4567</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Email sx={{ fontSize: 16, mr: 1, color: 'grey.400' }} />
                  <Typography variant="body2" color="grey.400">info@aeumbre.com</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <LocationOn sx={{ fontSize: 16, mr: 1, color: 'grey.400' }} />
                  <Typography variant="body2" color="grey.400">New York, NY</Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, backgroundColor: 'grey.700' }} />
          <Box textAlign="center">
            <Typography variant="body2" color="grey.400">
              © 2024 Aeumbre Security Services. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;