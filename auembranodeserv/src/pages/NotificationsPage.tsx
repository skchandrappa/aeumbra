import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Button,
  Divider,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Notifications,
  Security,
  Payment,
  Star,
  CalendarToday,
  CheckCircle,
  MoreVert,
  MarkAsUnread,
} from '@mui/icons-material';
// import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead } from '../hooks/useNotifications';

// interface Notification {
//   id: number;
//   type: 'booking_request' | 'booking_confirmed' | 'payment_received' | 'review_received' | 'profile_update' | 'booking_cancelled' | 'system' | 'feature_update';
//   title: string;
//   message: string;
//   is_read: boolean;
//   created_at: string;
//   data?: any;
// }

const NotificationsPage: React.FC = () => {
  // const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  // const isGuard = user?.user_type === 'guard';

  const { data: notifications = [] } = useNotifications();
  const { data: unreadCountData = { count: 0 } } = useUnreadCount();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_request': return <CalendarToday />;
      case 'booking_confirmed': return <CheckCircle />;
      case 'payment_received': return <Payment />;
      case 'review_received': return <Star />;
      case 'profile_update': return <Security />;
      case 'booking_cancelled': return <CalendarToday />;
      case 'system': return <Security />;
      case 'feature_update': return <Notifications />;
      default: return <Notifications />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking_request': return 'primary';
      case 'booking_confirmed': return 'success';
      case 'payment_received': return 'success';
      case 'review_received': return 'warning';
      case 'profile_update': return 'warning';
      case 'booking_cancelled': return 'error';
      case 'system': return 'info';
      case 'feature_update': return 'secondary';
      default: return 'default';
    }
  };

  const markAsRead = (notificationId: number) => {
    markAsReadMutation.mutate(notificationId.toString());
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const filteredNotifications = notifications.filter(notification => {
    if (tabValue === 0) return !notification.is_read; // Unread
    if (tabValue === 1) return notification.is_read; // Read
    return true; // All
  });

  // const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <Layout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Notifications
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Stay updated with your security services
            </Typography>
          </Box>
          {unreadCountData.count > 0 && (
            <Button
              variant="outlined"
              startIcon={<MarkAsUnread />}
              onClick={markAllAsRead}
            >
              Mark All as Read
            </Button>
          )}
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab 
              label={
                <Badge badgeContent={unreadCountData.count} color="primary">
                  Unread
                </Badge>
              } 
            />
            <Tab label="Read" />
            <Tab label="All" />
          </Tabs>
        </Box>

        {/* Notifications List */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            {filteredNotifications.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Notifications sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  {tabValue === 0 ? 'No unread notifications' : 'No notifications'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tabValue === 0 
                    ? 'You\'re all caught up!' 
                    : 'You\'ll see notifications here when you have updates'}
                </Typography>
              </Box>
            ) : (
              <List>
                {filteredNotifications.map((notification, index) => (
                  <React.Fragment key={notification.id}>
                    <ListItem
                      sx={{
                        backgroundColor: notification.is_read ? 'transparent' : 'action.hover',
                        '&:hover': {
                          backgroundColor: 'action.selected',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            backgroundColor: `${getNotificationColor(notification.type)}.main`,
                            color: 'white',
                          }}
                        >
                          {getNotificationIcon(notification.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography
                              variant="subtitle1"
                              fontWeight={notification.is_read ? 'normal' : 'bold'}
                            >
                              {notification.title}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                              {notification.data?.action_required && (
                                <Chip
                                  label="Action Required"
                                  color="warning"
                                  size="small"
                                />
                              )}
                              <Typography variant="body2" color="text.secondary">
                                {new Date(notification.created_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {notification.message}
                            </Typography>
                            {notification.data?.action_required && !notification.is_read && (
                              <Box sx={{ mt: 1 }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  startIcon={<CheckCircle />}
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Mark as Read
                                </Button>
                              </Box>
                            )}
                          </Box>
                        }
                      />
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    </ListItem>
                    {index < filteredNotifications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Notification Types Summary */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Notification Types
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            <Chip
              icon={<CalendarToday />}
              label="Booking Requests"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<Payment />}
              label="Payments"
              color="success"
              variant="outlined"
            />
            <Chip
              icon={<Star />}
              label="Reviews"
              color="warning"
              variant="outlined"
            />
            <Chip
              icon={<Security />}
              label="System Updates"
              color="info"
              variant="outlined"
            />
            <Chip
              icon={<Notifications />}
              label="Reminders"
              color="secondary"
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default NotificationsPage;
