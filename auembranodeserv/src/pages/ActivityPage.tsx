import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import {
  CalendarToday,
  TrendingUp,
  Star,
  Security,
  Payment,
  Schedule,
  LocationOn,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

interface ActivityItem {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'earning';
  title: string;
  description: string;
  amount?: number;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  client?: string;
  guard?: string;
  rating?: number;
}

const ActivityPage: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const isGuard = user?.user_type === 'guard';

  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'booking',
      title: 'Corporate Event Security',
      description: 'Security services for annual company gala',
      amount: 400,
      date: '2024-01-15',
      status: 'completed',
      client: 'Sarah Williams',
      rating: 5,
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      description: 'Payment for Wedding Security service',
      amount: 600,
      date: '2024-01-20',
      status: 'completed',
    },
    {
      id: '3',
      type: 'review',
      title: 'New Review Received',
      description: '5-star review from John Smith',
      date: '2024-01-22',
      status: 'completed',
      client: 'John Smith',
      rating: 5,
    },
    {
      id: '4',
      type: 'booking',
      title: 'Office Building Security',
      description: 'Daily security services for office building',
      amount: 320,
      date: '2024-01-10',
      status: 'completed',
      client: 'ABC Corporation',
      rating: 4,
    },
  ];

  const earnings = isGuard
    ? [
        { month: 'January 2024', bookings: 8, earnings: 2400, hours: 60 },
        { month: 'December 2023', bookings: 12, earnings: 3600, hours: 90 },
        { month: 'November 2023', bookings: 6, earnings: 1800, hours: 45 },
      ]
    : [
        { month: 'January 2024', bookings: 3, spent: 1200, hours: 30 },
        { month: 'December 2023', bookings: 2, spent: 800, hours: 20 },
        { month: 'November 2023', bookings: 1, spent: 400, hours: 10 },
      ];

  const handleTabChange = (event: any, newValue: number) => {
    setTabValue(newValue);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <CalendarToday />;
      case 'payment': return <Payment />;
      case 'review': return <Star />;
      case 'earning': return <TrendingUp />;
      default: return <Security />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom>
          {isGuard ? 'Earnings & Activity' : 'Booking History'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {isGuard
            ? 'Track your earnings and work history'
            : 'View your booking history and reviews'}
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      {isGuard ? 'This Month Earnings' : 'This Month Spent'}
                    </Typography>
                    <Typography variant="h4" component="div">
                      ${earnings[0] ? (earnings[0] as any).earnings || (earnings[0] as any).spent || 0 : 0}
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Total Bookings
                    </Typography>
                    <Typography variant="h4" component="div">
                      {earnings[0]?.bookings || 0}
                    </Typography>
                  </Box>
                  <CalendarToday sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Hours Worked
                    </Typography>
                    <Typography variant="h4" component="div">
                      {earnings[0]?.hours || 0}
                    </Typography>
                  </Box>
                  <Schedule sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="body2">
                      Average Rating
                    </Typography>
                    <Typography variant="h4" component="div">
                      4.8
                    </Typography>
                  </Box>
                  <Star sx={{ fontSize: 40, color: 'warning.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Recent Activity" />
            <Tab label={isGuard ? 'Earnings History' : 'Spending History'} />
          </Tabs>
        </Box>

        {/* Recent Activity Tab */}
        {tabValue === 0 && (
          <Card>
            <CardContent>
              <List>
                {activities.map((activity, index) => (
                  <Box key={activity.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: 'primary.main' }}>
                          {getActivityIcon(activity.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight="bold">
                              {activity.title}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                              {activity.amount && (
                                <Typography variant="h6" color="primary">
                                  ${activity.amount}
                                </Typography>
                              )}
                              <Chip
                                label={activity.status}
                                color={getStatusColor(activity.status) as any}
                                size="small"
                              />
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {activity.description}
                            </Typography>
                            <Box display="flex" alignItems="center" sx={{ mt: 0.5 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                                {activity.date}
                              </Typography>
                              {activity.client && (
                                <Typography variant="body2" color="text.secondary">
                                  with {activity.client}
                                </Typography>
                              )}
                              {activity.rating && (
                                <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
                                  <Star sx={{ fontSize: 14, color: 'warning.main', mr: 0.5 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {activity.rating}/5
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < activities.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Earnings/Spending History Tab */}
        {tabValue === 1 && (
          <Card>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell align="right">Bookings</TableCell>
                      <TableCell align="right">Hours</TableCell>
                      <TableCell align="right">
                        {isGuard ? 'Earnings' : 'Spent'}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {earnings.map((earning, index) => (
                      <TableRow key={index}>
                        <TableCell>{earning.month}</TableCell>
                        <TableCell align="right">{earning.bookings}</TableCell>
                        <TableCell align="right">{earning.hours}</TableCell>
                        <TableCell align="right">
                          ${isGuard ? (earning as any).earnings : (earning as any).spent}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>
    </Layout>
  );
};

export default ActivityPage;
