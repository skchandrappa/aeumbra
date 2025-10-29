import React, { useState, MouseEvent } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Home,
  Person,
  Settings,
  Notifications,
  Security,
  CalendarToday,
  Timeline,
  Star,
  Logout,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUnreadCount } from '../hooks/useNotifications';
import { UnreadCountData } from '../types';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { data: unreadCountData = { unread_count: 0 } } = useUnreadCount() as { data: UnreadCountData | undefined };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  // Bottom navigation items (main navigation)
  const bottomNavItems = [
    { 
      label: 'HOME', 
      icon: <Home />, 
      path: '/feed',
      value: 'home'
    },
    { 
      label: user?.user_type === 'guard' ? 'BOOKINGS' : 'BOOK', 
      icon: user?.user_type === 'guard' ? <CalendarToday /> : <Security />, 
      path: '/bookings',
      value: 'book'
    },
    { 
      label: 'ACTIVITY', 
      icon: <Timeline />, 
      path: '/activity',
      value: 'activity'
    },
    { 
      label: 'REVIEWS', 
      icon: <Star />, 
      path: '/reviews',
      value: 'reviews'
    },
  ];

  // Get current bottom nav value based on path
  const getCurrentBottomNavValue = () => {
    const currentItem = bottomNavItems.find(item => item.path === location.pathname);
    return currentItem?.value || 'home';
  };

  const handleBottomNavChange = (event: React.SyntheticEvent, newValue: string) => {
    const item = bottomNavItems.find(item => item.value === newValue);
    if (item) {
      navigate(item.path);
    }
  };

  // Profile Menu
  const profileMenu = (
    <Menu
      anchorEl={profileAnchorEl}
      open={Boolean(profileAnchorEl)}
      onClose={handleProfileMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 200,
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1,
          },
        },
      }}
    >
      <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
        <ListItemIcon>
          <Person fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </MenuItem>
      <MenuItem onClick={() => { navigate('/settings'); handleProfileMenuClose(); }}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </MenuItem>
      <MenuItem onClick={() => { navigate('/notifications'); handleProfileMenuClose(); }}>
        <ListItemIcon>
          {unreadCountData.unread_count > 0 ? (
            <Badge badgeContent={unreadCountData.unread_count} color="error">
              <Notifications fontSize="small" />
            </Badge>
          ) : (
            <Notifications fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText primary="Notifications" />
      </MenuItem>
      <MenuItem onClick={() => { handleLogout(); handleProfileMenuClose(); }}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </MenuItem>
    </Menu>
  );

  if (!isMobile) {
    // For desktop, use the original layout
    return (
      <Box sx={{ display: 'flex' }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            minHeight: '100vh',
          }}
        >
          {children}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: '#000000',
          color: 'white',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', gap: 1 }}>
          {/* Logo */}
          <Box
            component="img"
            src="/aeumbra1.png"
            alt="Aeumbre"
            sx={{
              height: 32,
              objectFit: 'contain',
            }}
          />
          
          {/* Top Right Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* User ID (compact) */}
            {user && (
              <Box sx={{ mr: 0.5, display: 'flex', alignItems: 'center' }}>
                <Box
                  component="span"
                  sx={{
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.8)'
                  }}
                >
                  ID: {user.id}
                </Box>
              </Box>
            )}
            {/* Notifications */}
            <IconButton
              color="inherit"
              onClick={() => navigate('/notifications')}
              sx={{ p: 1 }}
            >
              {unreadCountData.unread_count > 0 ? (
                <Badge badgeContent={unreadCountData.unread_count} color="error">
                  <Notifications />
                </Badge>
              ) : (
                <Notifications />
              )}
            </IconButton>
            {/* Settings */}
            <IconButton
              color="inherit"
              onClick={() => navigate('/settings')}
              sx={{ p: 1 }}
            >
              <Settings />
            </IconButton>
            {/* Profile */}
            <IconButton
              color="inherit"
              onClick={() => navigate('/profile')}
              sx={{ p: 0.5 }}
            >
              <Avatar 
                sx={{ 
                  width: 28, 
                  height: 28,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                }}
              >
                {user?.profile?.first_name?.[0] || user?.email?.[0] || 'U'}
              </Avatar>
            </IconButton>
            {/* Logout */}
            <IconButton
              color="inherit"
              onClick={handleLogout}
              sx={{ p: 1 }}
              aria-label="logout"
            >
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          pt: 8, // Account for fixed app bar
          pb: 8, // Account for bottom navigation
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: '#000000',
          color: 'white',
        }} 
        elevation={3}
      >
        <BottomNavigation
          value={getCurrentBottomNavValue()}
          onChange={handleBottomNavChange}
          sx={{
            backgroundColor: '#000000',
            '& .MuiBottomNavigationAction-root': {
              color: 'rgba(255, 255, 255, 0.6)',
              '&.Mui-selected': {
                color: '#ffffff',
              },
            },
            '& .MuiBottomNavigationAction-label': {
              fontSize: '0.75rem',
              fontWeight: 500,
            },
          }}
        >
          {bottomNavItems.map((item) => (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              icon={item.icon}
              value={item.value}
            />
          ))}
        </BottomNavigation>
      </Paper>

      {profileMenu}
    </Box>
  );
};

export default MobileLayout;
