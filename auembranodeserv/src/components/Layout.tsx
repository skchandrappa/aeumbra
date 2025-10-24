import React, { useState, MouseEvent } from 'react';
import {
  Box,
  Drawer,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
// import DemoBanner from './DemoBanner'; // Removed demo banner
import {
  // Menu as MenuIcon,
  Home,
  Person,
  Settings,
  Notifications,
  Security,
  CalendarToday,
  Timeline,
  Star,
  AdminPanelSettings,
  AccountCircle,
  Logout,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUnreadCount } from '../hooks/useNotifications';
import { UnreadCountData } from '../types';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { data: unreadCountData = { unread_count: 0 } } = useUnreadCount() as { data: UnreadCountData | undefined };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const sidebarItems = [
    // Main navigation items
    { text: 'HOME', icon: <Home />, path: '/feed' },
    { text: user?.user_type === 'guard' ? 'BOOKINGS' : 'BOOK', icon: user?.user_type === 'guard' ? <CalendarToday /> : <Security />, path: '/bookings' },
    { text: 'ACTIVITY', icon: <Timeline />, path: '/activity' },
    { text: 'REVIEWS', icon: <Star />, path: '/reviews' },
    { 
      text: 'NOTIFICATIONS', 
      icon: unreadCountData.unread_count > 0 ? (
        <Badge badgeContent={unreadCountData.unread_count} color="error">
          <Notifications />
        </Badge>
      ) : <Notifications />, 
      path: '/notifications' 
    },
    // Profile and settings
    { text: 'PROFILE', icon: <Person />, path: '/profile' },
    { text: 'SETTINGS', icon: <Settings />, path: '/settings' },
  ];

  // Add admin pricing page for admin users
  if (user?.user_type === 'admin') {
    sidebarItems.push({
      text: 'PRICING MANAGEMENT',
      icon: <AdminPanelSettings />,
      path: '/admin/pricing'
    });
  }

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Header */}
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Box
                    component="img"
                    src="/aeumbra1.png"
                    alt="Aeumbre"
                    sx={{
                      width: '100%',
                      height: 60,
                      objectFit: 'contain',
                      borderRadius: 0.5,
                      maxWidth: '100%'
                    }}
                  />
                </Box>
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
      
      {/* Navigation Items */}
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {sidebarItems.slice(0, 4).map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  color: 'white',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={{ color: 'white' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Profile Section at Bottom */}
      <Box>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)', my: 1 }} />
        <List>
          {sidebarItems.slice(4).map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  color: 'white',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={{ color: 'white' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        {/* Connections Section */}
        <Box sx={{ px: 2, py: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            Connections
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {/* Sample connection avatars */}
            {[1, 2, 3, 4, 5].map((i) => (
              <Avatar
                key={i}
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: '0.75rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                {String.fromCharCode(65 + i)}
              </Avatar>
            ))}
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              +
            </Avatar>
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1, display: 'block' }}>
            5 connections
          </Typography>
        </Box>
        
        {/* User Profile Display */}
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                mr: 1, 
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                }
              }}
              onClick={handleProfileMenuOpen}
            >
              {user?.profile?.first_name?.[0] || user?.email?.[0] || 'U'}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                {user?.profile?.first_name || user?.email || 'User'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {user?.user_type === 'guard' ? 'Security Professional' : 'Security Services'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => navigate('/profile')}
              sx={{ color: 'white' }}
            >
              <AccountCircle fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => navigate('/settings')}
              sx={{ color: 'white' }}
            >
              <Settings fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleLogout}
              sx={{ color: 'white' }}
            >
              <Logout fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  // Profile Menu
  const profileMenu = (
    <Menu
      anchorEl={profileAnchorEl}
      open={Boolean(profileAnchorEl)}
      onClose={handleProfileMenuClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'bottom',
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
      <Divider />
      <MenuItem onClick={() => { handleLogout(); handleProfileMenuClose(); }}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#000000',
              color: 'white',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: '#000000',
              color: 'white',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
      {profileMenu}
    </Box>
  );
};

export default Layout;
