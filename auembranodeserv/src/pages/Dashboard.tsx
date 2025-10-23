import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Security,
  CalendarToday,
  TrendingUp,
  Notifications,
  Star,
  LocationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isGuard = user?.user_type === 'guard';

  // Mock data - in real app, this would come from API
  const stats = isGuard
    ? [
        { title: 'Active Bookings', value: '3', icon: <CalendarToday />, color: 'primary' },
        { title: 'This Month Earnings', value: '$2,450', icon: <TrendingUp />, color: 'success' },
        { title: 'Average Rating', value: '4.8', icon: <Star />, color: 'warning' },
        { title: 'Total Bookings', value: '47', icon: <Security />, color: 'info' },
      ]
    : [
        { title: 'Upcoming Events', value: '2', icon: <CalendarToday />, color: 'primary' },
        { title: 'Total Bookings', value: '12', icon: <Security />, color: 'info' },
        { title: 'Saved Guards', value: '5', icon: <Star />, color: 'warning' },
        { title: 'Reviews Given', value: '8', icon: <TrendingUp />, color: 'success' },
      ];

  const recentActivity = isGuard
    ? [
        { text: 'New booking request for Corporate Event', time: '2 hours ago', type: 'booking' },
        { text: 'Payment received for Security Service', time: '1 day ago', type: 'payment' },
        { text: 'Review received from John Smith', time: '2 days ago', type: 'review' },
      ]
    : [
        { text: 'Booking confirmed with Mike Johnson', time: '1 hour ago', type: 'booking' },
        { text: 'Payment processed for Event Security', time: '3 hours ago', type: 'payment' },
        { text: 'New guard available in your area', time: '1 day ago', type: 'notification' },
      ];

  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.profile?.first_name || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {isGuard
            ? 'Here\'s your security professional dashboard'
            : 'Here\'s your security services dashboard'}
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom variant="body2">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" component="div">
                        {stat.value}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        backgroundColor: `${stat.color}.main`,
                        color: 'white',
                        borderRadius: '50%',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  {isGuard ? (
                    <>
                      <Button
                        variant="contained"
                        startIcon={<CalendarToday />}
                        onClick={() => navigate('/bookings')}
                        fullWidth
                      >
                        View Booking Requests
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Security />}
                        onClick={() => navigate('/feed')}
                        fullWidth
                      >
                        Post Work Update
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        startIcon={<Security />}
                        onClick={() => navigate('/bookings')}
                        fullWidth
                      >
                        Find Security Services
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CalendarToday />}
                        onClick={() => navigate('/activity')}
                        fullWidth
                      >
                        View My Bookings
                      </Button>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                <List>
                  {recentActivity.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              backgroundColor:
                                activity.type === 'booking'
                                  ? 'primary.main'
                                  : activity.type === 'payment'
                                  ? 'success.main'
                                  : 'warning.main',
                            }}
                          >
                            {activity.type === 'booking' ? (
                              <CalendarToday />
                            ) : activity.type === 'payment' ? (
                              <TrendingUp />
                            ) : (
                              <Notifications />
                            )}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.text}
                          secondary={activity.time}
                        />
                      </ListItem>
                      {index < recentActivity.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Completion */}
          {user?.profile && !user.profile.is_profile_complete && (
            <Grid item xs={12}>
              <Card sx={{ backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Complete Your Profile
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {isGuard
                      ? 'Complete your profile to start accepting bookings and building your reputation.'
                      : 'Complete your profile to get better matches with security professionals.'}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/profile')}
                    sx={{ backgroundColor: 'white', color: 'warning.main' }}
                  >
                    Complete Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Layout>
  );
};

export default Dashboard;
