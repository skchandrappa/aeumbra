import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  Search,
  CheckCircle,
  Cancel,
  Add,
  SmartToy,
  Send,
  Assignment,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

interface Booking {
  id: string;
  event_type: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  description: string;
  special_requirements?: string;
  created_at: string;
  requester?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    rating: number;
    phone: string;
  };
  guard?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    rating: number;
    experience_years: number;
  };
}

const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTab, setSearchTab] = useState(0);
  const [aiMessage, setAiMessage] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);
  
  const [searchForm, setSearchForm] = useState({
    location: '',
    date: '',
    guardType: '',
    experience: '',
    rating: '',
    priceRange: '',
  });

  const [bookingForm, setBookingForm] = useState({
    event_type: '',
    event_date: '',
    start_time: '',
    end_time: '',
    location: '',
    description: '',
    special_requirements: '',
    total_amount: 0,
  });

  // Mock data
  const bookings: Booking[] = [
    {
      id: '1',
      event_type: 'Corporate Event',
      event_date: '2024-01-15',
      start_time: '09:00',
      end_time: '17:00',
      location: 'Downtown Convention Center',
      description: 'Security for annual corporate meeting',
      status: 'confirmed',
      total_amount: 800,
      special_requirements: 'Must have experience with VIP events',
      created_at: '2024-01-10T10:00:00Z',
      requester: {
        id: 'user1',
        first_name: 'John',
        last_name: 'Doe',
        rating: 4.8,
        phone: '+1234567890',
      },
      guard: {
        id: 'guard1',
        first_name: 'Mike',
        last_name: 'Johnson',
        rating: 4.9,
        experience_years: 5,
      },
    },
    {
      id: '2',
      event_type: 'Wedding',
      event_date: '2024-01-20',
      start_time: '14:00',
      end_time: '22:00',
      location: 'Garden Venue',
      description: 'Wedding security services',
      status: 'pending',
      total_amount: 600,
      created_at: '2024-01-12T14:30:00Z',
      requester: {
        id: 'user2',
        first_name: 'Sarah',
        last_name: 'Wilson',
        rating: 4.7,
        phone: '+1234567891',
      },
    },
  ];

  // Check user type (for future use)
  // const isGuard = user?.user_type === 'guard';
  // const isAdmin = user?.user_type === 'admin';

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearchTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSearchTab(newValue);
  };


  const handleBookingFormChange = (field: string, value: string | number) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitBooking = () => {
    console.log('Posting security request:', bookingForm);
    // Reset form after submission
    setBookingForm({
      event_type: '',
      event_date: '',
      start_time: '',
      end_time: '',
      location: '',
      description: '',
      special_requirements: '',
      total_amount: 0,
    });
  };


  const handleSearchFormChange = (field: string, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearchGuards = () => {
    console.log('Searching guards with:', searchForm);
  };

  const handleAiSearch = () => {
    if (aiMessage.trim()) {
      const newMessages = [...aiMessages, { type: 'user' as const, message: aiMessage }];
      setAiMessages(newMessages);
      
      setTimeout(() => {
        setAiMessages([...newMessages, { 
          type: 'ai' as const, 
          message: `I found 3 guards matching your criteria: "${aiMessage}". Here are the top matches based on your requirements...` 
        }]);
      }, 1000);
      
      setAiMessage('');
    }
  };


  // Filter bookings for the logged-in user
  const userBookings = bookings.filter(booking => 
    booking.requester?.id === user?.id?.toString()
  );

  const SearchForm = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Find Security Guards
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Location"
              value={searchForm.location}
              onChange={(e) => handleSearchFormChange('location', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={searchForm.date}
              onChange={(e) => handleSearchFormChange('date', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Guard Type</InputLabel>
              <Select
                value={searchForm.guardType}
                onChange={(e) => handleSearchFormChange('guardType', e.target.value)}
              >
                <MenuItem value="personal">Personal Security</MenuItem>
                <MenuItem value="event">Event Security</MenuItem>
                <MenuItem value="corporate">Corporate Security</MenuItem>
                <MenuItem value="residential">Residential Security</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Experience</InputLabel>
              <Select
                value={searchForm.experience}
                onChange={(e) => handleSearchFormChange('experience', e.target.value)}
              >
                <MenuItem value="1-2">1-2 years</MenuItem>
                <MenuItem value="3-5">3-5 years</MenuItem>
                <MenuItem value="5+">5+ years</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Minimum Rating</InputLabel>
              <Select
                value={searchForm.rating}
                onChange={(e) => handleSearchFormChange('rating', e.target.value)}
              >
                <MenuItem value="4.0">4.0+ stars</MenuItem>
                <MenuItem value="4.5">4.5+ stars</MenuItem>
                <MenuItem value="4.8">4.8+ stars</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Search />}
              onClick={handleSearchGuards}
              sx={{ mt: 2 }}
            >
              Search Guards
            </Button>
          </Grid>
        </Grid>
        
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Search Tips:</strong> Use specific locations for better results. 
            Include date and time requirements. Higher ratings indicate more experienced guards.
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );

  const AiSearchForm = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <SmartToy sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">
            AI-Powered Guard Search
          </Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Describe your security needs in natural language..."
            value={aiMessage}
            onChange={(e) => setAiMessage(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleAiSearch} disabled={!aiMessage.trim()}>
                    <Send />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {aiMessages.length > 0 && (
          <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
            {aiMessages.map((msg, index) => (
              <Box key={index} sx={{ mb: 1, textAlign: msg.type === 'user' ? 'right' : 'left' }}>
                <Chip
                  label={msg.message}
                  color={msg.type === 'user' ? 'primary' : 'default'}
                  variant={msg.type === 'user' ? 'filled' : 'outlined'}
                />
              </Box>
            ))}
          </Box>
        )}

        <Alert severity="info">
          <Typography variant="body2">
            <strong>AI Search Examples:</strong>
            <br />• "I need a guard for a wedding on Saturday evening in downtown"
            <br />• "Looking for experienced security for a corporate event with VIP guests"
            <br />• "Need 24/7 residential security with background in law enforcement"
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );

  const PostRequestForm = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Assignment sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">
            Post Security Request
          </Typography>
        </Box>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>How it works:</strong> Your request will be posted to the security guard community. 
            Qualified guards will see your post and can reach out to you directly. 
            You'll receive notifications when guards express interest in your request.
          </Typography>
        </Alert>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Event Type"
              value={bookingForm.event_type}
              onChange={(e) => handleBookingFormChange('event_type', e.target.value)}
              placeholder="e.g., Wedding, Corporate Event, Private Party"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Event Date"
              type="date"
              value={bookingForm.event_date}
              onChange={(e) => handleBookingFormChange('event_date', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Start Time"
              type="time"
              value={bookingForm.start_time}
              onChange={(e) => handleBookingFormChange('start_time', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="End Time"
              type="time"
              value={bookingForm.end_time}
              onChange={(e) => handleBookingFormChange('end_time', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Location"
              value={bookingForm.location}
              onChange={(e) => handleBookingFormChange('location', e.target.value)}
              placeholder="Full address or venue name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Event Description"
              value={bookingForm.description}
              onChange={(e) => handleBookingFormChange('description', e.target.value)}
              placeholder="Describe your event, expected number of guests, security requirements, etc."
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Special Requirements"
              value={bookingForm.special_requirements}
              onChange={(e) => handleBookingFormChange('special_requirements', e.target.value)}
              placeholder="Any specific qualifications, certifications, or experience needed"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Budget Range"
              type="number"
              value={bookingForm.total_amount}
              onChange={(e) => handleBookingFormChange('total_amount', parseFloat(e.target.value))}
              placeholder="Expected total amount"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<Add />}
              onClick={handleSubmitBooking}
              size="large"
              sx={{ mt: 2 }}
            >
              Post Security Request
            </Button>
          </Grid>
        </Grid>

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Important:</strong> Your request will be visible to all security guards on the platform. 
            Make sure to include all necessary details to attract the right candidates. 
            You can always edit or remove your post later.
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );

  const RequestTabs = () => (
    <Card>
      <CardContent>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="My Requests" />
          <Tab label="Confirmed Bookings" />
          <Tab label="Completed" />
          <Tab label="Cancelled" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Pending Requests
            </Typography>
            {userBookings.filter(b => b.status === 'pending').length === 0 ? (
              <Alert severity="info">No pending requests</Alert>
            ) : (
              <List>
                {userBookings.filter(b => b.status === 'pending').map((booking) => (
                  <ListItem key={booking.id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        <Assignment />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={booking.event_type}
                      secondary={`${booking.event_date} at ${booking.location}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip label="Pending" color="warning" />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirmed Bookings
            </Typography>
            {userBookings.filter(b => b.status === 'confirmed').length === 0 ? (
              <Alert severity="info">No confirmed bookings</Alert>
            ) : (
              <List>
                {userBookings.filter(b => b.status === 'confirmed').map((booking) => (
                  <ListItem key={booking.id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        <CheckCircle />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={booking.event_type}
                      secondary={`${booking.event_date} at ${booking.location}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip label="Confirmed" color="success" />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Completed Bookings
            </Typography>
            {userBookings.filter(b => b.status === 'completed').length === 0 ? (
              <Alert severity="info">No completed bookings</Alert>
            ) : (
              <List>
                {userBookings.filter(b => b.status === 'completed').map((booking) => (
                  <ListItem key={booking.id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        <CheckCircle />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={booking.event_type}
                      secondary={`${booking.event_date} at ${booking.location}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip label="Completed" color="success" />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Cancelled Bookings
            </Typography>
            {userBookings.filter(b => b.status === 'cancelled').length === 0 ? (
              <Alert severity="info">No cancelled bookings</Alert>
            ) : (
              <List>
                {userBookings.filter(b => b.status === 'cancelled').map((booking) => (
                  <ListItem key={booking.id} divider>
                    <ListItemAvatar>
                      <Avatar>
                        <Cancel />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={booking.event_type}
                      secondary={`${booking.event_date} at ${booking.location}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip label="Cancelled" color="error" />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Security Bookings
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Find and book security guards for your events
        </Typography>

        {/* Search Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Tabs value={searchTab} onChange={handleSearchTabChange} sx={{ mb: 2 }}>
              <Tab label="Search Guards" />
              <Tab label="AI Search" />
              <Tab label="Post Request" />
            </Tabs>

            {searchTab === 0 && <SearchForm />}
            {searchTab === 1 && <AiSearchForm />}
            {searchTab === 2 && <PostRequestForm />}
          </CardContent>
        </Card>

        {/* Request Management Tabs */}
        <RequestTabs />
      </Box>
    </Layout>
  );
};

export default BookingsPage;