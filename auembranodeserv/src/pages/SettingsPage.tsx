import React, { useState, SyntheticEvent, ChangeEvent } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Tabs,
  Tab,
  Paper,
  Chip,
} from '@mui/material';
import {
  Notifications,
  Security,
  Language,
  DarkMode,
  VolumeUp,
  LocationOn,
  Email,
  Phone,
  Person,
  Shield,
  Logout,
  AccountCircle,
  Gavel,
  ReportProblem,
  Assignment,
  CheckCircle,
  Cancel,
  Schedule,
  PriorityHigh,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    bookingUpdates: true,
    paymentUpdates: true,
    reviewNotifications: true,
    marketingEmails: false,
    
    // Privacy settings
    profileVisibility: 'public',
    showContactInfo: true,
    showEarnings: false,
    allowDirectMessages: true,
    
    // App settings
    language: 'en',
    timezone: 'UTC',
    darkMode: false,
    soundEnabled: true,
    vibrationEnabled: true,
    
    // Security settings
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  // Dispute states
  const [disputeForm, setDisputeForm] = useState({
    category: '',
    bookingId: '',
    priority: 'medium',
    subject: '',
    description: '',
    evidence: [] as File[],
  });
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // In real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDisputeFormChange = (field: string, value: any) => {
    setDisputeForm({ ...disputeForm, [field]: value });
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setDisputeForm({ ...disputeForm, evidence: [...disputeForm.evidence, ...files] });
  };

  const handleSubmitDispute = async () => {
    setIsLoading(true);
    try {
      // In real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage('Dispute submitted successfully! Our team will review it within 24 hours.');
      setShowDisputeForm(false);
      setDisputeForm({
        category: '',
        bookingId: '',
        priority: 'medium',
        subject: '',
        description: '',
        evidence: [],
      });
    } catch (error) {
      console.error('Error submitting dispute:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isGuard = user?.user_type === 'guard';

  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage your account preferences and notifications
        </Typography>

        {saveMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {saveMessage}
          </Alert>
        )}

        <Paper sx={{ width: '100%' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
              },
            }}
          >
            <Tab
              icon={<Notifications />}
              label="Notifications"
              iconPosition="start"
            />
            <Tab
              icon={<Person />}
              label="Privacy"
              iconPosition="start"
            />
            <Tab
              icon={<Language />}
              label="App"
              iconPosition="start"
            />
                        <Tab
                          icon={<Shield />}
                          label="Security"
                          iconPosition="start"
                        />
                        <Tab
                          icon={<AccountCircle />}
                          label="Account"
                          iconPosition="start"
                        />
                        <Tab
                          icon={<Gavel />}
                          label="Dispute Center"
                          iconPosition="start"
                        />
                      </Tabs>

          {/* Notifications Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Notification Preferences
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Email Notifications"
                          secondary="Receive updates via email"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.emailNotifications}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('emailNotifications', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Push Notifications"
                          secondary="Receive push notifications on your device"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.pushNotifications}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('pushNotifications', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="SMS Notifications"
                          secondary="Receive updates via text message"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.smsNotifications}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('smsNotifications', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Booking Updates"
                          secondary={isGuard ? "Get notified about new booking requests" : "Get notified about booking status changes"}
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.bookingUpdates}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('bookingUpdates', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Payment Updates"
                          secondary="Get notified about payment activities"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.paymentUpdates}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('paymentUpdates', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Review Notifications"
                          secondary="Get notified when you receive reviews"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.reviewNotifications}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('reviewNotifications', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Marketing Emails"
                          secondary="Receive promotional emails and updates"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.marketingEmails}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('marketingEmails', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Privacy Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Privacy Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Profile Visibility"
                          secondary="Control who can see your profile"
                        />
                        <ListItemSecondaryAction>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={settings.profileVisibility}
                              onChange={(e: SelectChangeEvent<string>) => handleSettingChange('profileVisibility', e.target.value)}
                            >
                              <MenuItem value="public">Public</MenuItem>
                              <MenuItem value="private">Private</MenuItem>
                              <MenuItem value="contacts">Contacts Only</MenuItem>
                            </Select>
                          </FormControl>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Show Contact Information"
                          secondary="Display your contact details on your profile"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.showContactInfo}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('showContactInfo', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      {isGuard && (
                        <ListItem>
                          <ListItemText
                            primary="Show Earnings"
                            secondary="Display your earnings publicly"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              checked={settings.showEarnings}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('showEarnings', e.target.checked)}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      )}
                      <ListItem>
                        <ListItemText
                          primary="Allow Direct Messages"
                          secondary="Let other users send you direct messages"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.allowDirectMessages}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('allowDirectMessages', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* App Settings Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Language sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Language & Region
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Language"
                          secondary="Select your preferred language"
                        />
                        <ListItemSecondaryAction>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={settings.language}
                              onChange={(e: SelectChangeEvent<string>) => handleSettingChange('language', e.target.value)}
                            >
                              <MenuItem value="en">English</MenuItem>
                              <MenuItem value="es">Spanish</MenuItem>
                              <MenuItem value="fr">French</MenuItem>
                              <MenuItem value="de">German</MenuItem>
                            </Select>
                          </FormControl>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Timezone"
                          secondary="Set your local timezone"
                        />
                        <ListItemSecondaryAction>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={settings.timezone}
                              onChange={(e: SelectChangeEvent<string>) => handleSettingChange('timezone', e.target.value)}
                            >
                              <MenuItem value="UTC">UTC</MenuItem>
                              <MenuItem value="EST">Eastern Time</MenuItem>
                              <MenuItem value="PST">Pacific Time</MenuItem>
                              <MenuItem value="CST">Central Time</MenuItem>
                            </Select>
                          </FormControl>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <DarkMode sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Display & Sound
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Dark Mode"
                          secondary="Use dark theme"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.darkMode}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('darkMode', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Sound Effects"
                          secondary="Play sounds for notifications"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.soundEnabled}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('soundEnabled', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Vibration"
                          secondary="Vibrate for notifications"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.vibrationEnabled}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('vibrationEnabled', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Shield sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Security Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Two-Factor Authentication"
                          secondary="Add an extra layer of security to your account"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.twoFactorAuth}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('twoFactorAuth', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Login Alerts"
                          secondary="Get notified when someone logs into your account"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings.loginAlerts}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('loginAlerts', e.target.checked)}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Session Timeout"
                          secondary="Automatically log out after inactivity (minutes)"
                        />
                        <ListItemSecondaryAction>
                          <TextField
                            size="small"
                            type="number"
                            value={settings.sessionTimeout}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                            sx={{ width: 80 }}
                            inputProps={{ min: 5, max: 480 }}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Account Tab */}
          <TabPanel value={tabValue} index={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Account Information
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Email"
                          secondary={user?.email || 'Not available'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="User Type"
                          secondary={user?.user_type === 'guard' ? 'Security Professional' : 'Security Services'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Account Status"
                          secondary={user?.is_active ? 'Active' : 'Inactive'}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Account Actions
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Logout"
                          secondary="Sign out of your account"
                        />
                        <ListItemSecondaryAction>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Logout />}
                            onClick={handleLogout}
                            sx={{ minWidth: 120 }}
                          >
                            Logout
                          </Button>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Dispute Center Tab */}
          <TabPanel value={tabValue} index={5}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                      <Typography variant="h6" gutterBottom>
                        <Gavel sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Dispute Center
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<ReportProblem />}
                        onClick={() => setShowDisputeForm(true)}
                        sx={{ backgroundColor: 'error.main' }}
                      >
                        Raise New Dispute
                      </Button>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      If you have any issues with bookings, payments, or other users, you can raise a dispute here. 
                      Our support team will review and resolve disputes within 24-48 hours.
                    </Typography>

                    {/* Dispute Form */}
                    {showDisputeForm && (
                      <Card sx={{ mb: 3, border: '2px solid', borderColor: 'error.main' }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom color="error">
                            Submit New Dispute
                          </Typography>
                          
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <FormControl fullWidth>
                                <InputLabel>Dispute Category</InputLabel>
                                <Select
                                  value={disputeForm.category}
                                  onChange={(e: SelectChangeEvent<string>) => handleDisputeFormChange('category', e.target.value)}
                                  label="Dispute Category"
                                >
                                  <MenuItem value="booking">Booking Issues</MenuItem>
                                  <MenuItem value="payment">Payment Problems</MenuItem>
                                  <MenuItem value="user_behavior">User Behavior</MenuItem>
                                  <MenuItem value="service_quality">Service Quality</MenuItem>
                                  <MenuItem value="cancellation">Cancellation Issues</MenuItem>
                                  <MenuItem value="other">Other</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="Booking ID (if applicable)"
                                value={disputeForm.bookingId}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleDisputeFormChange('bookingId', e.target.value)}
                                placeholder="Enter booking reference number"
                              />
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              <FormControl fullWidth>
                                <InputLabel>Priority Level</InputLabel>
                                <Select
                                  value={disputeForm.priority}
                                  onChange={(e: SelectChangeEvent<string>) => handleDisputeFormChange('priority', e.target.value)}
                                  label="Priority Level"
                                >
                                  <MenuItem value="low">Low - General inquiry</MenuItem>
                                  <MenuItem value="medium">Medium - Standard issue</MenuItem>
                                  <MenuItem value="high">High - Urgent matter</MenuItem>
                                  <MenuItem value="critical">Critical - Emergency</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="Subject"
                                value={disputeForm.subject}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleDisputeFormChange('subject', e.target.value)}
                                placeholder="Brief description of the issue"
                              />
                            </Grid>
                            
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Detailed Description"
                                value={disputeForm.description}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleDisputeFormChange('description', e.target.value)}
                                placeholder="Please provide as much detail as possible about the issue, including dates, times, and any relevant information..."
                              />
                            </Grid>
                            
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" gutterBottom>
                                Upload Evidence (Optional)
                              </Typography>
                              <input
                                type="file"
                                multiple
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                                id="evidence-upload"
                              />
                              <label htmlFor="evidence-upload">
                                <Button variant="outlined" component="span" startIcon={<Assignment />}>
                                  Choose Files
                                </Button>
                              </label>
                              {disputeForm.evidence.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                  {disputeForm.evidence.map((file, index) => (
                                    <Chip
                                      key={index}
                                      label={file.name}
                                      onDelete={() => {
                                        const newEvidence = disputeForm.evidence.filter((_, i) => i !== index);
                                        handleDisputeFormChange('evidence', newEvidence);
                                      }}
                                      sx={{ mr: 1, mb: 1 }}
                                    />
                                  ))}
                                </Box>
                              )}
                            </Grid>
                            
                            <Grid item xs={12}>
                              <Box display="flex" gap={2}>
                                <Button
                                  variant="contained"
                                  onClick={handleSubmitDispute}
                                  disabled={isLoading || !disputeForm.category || !disputeForm.subject || !disputeForm.description}
                                  startIcon={<CheckCircle />}
                                >
                                  {isLoading ? 'Submitting...' : 'Submit Dispute'}
                                </Button>
                                <Button
                                  variant="outlined"
                                  onClick={() => setShowDisputeForm(false)}
                                  startIcon={<Cancel />}
                                >
                                  Cancel
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    )}

                    {/* Dispute History */}
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Your Disputes
                    </Typography>
                    
                    <List>
                      {/* Sample dispute items */}
                      <ListItem sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Payment Not Received
                              </Typography>
                              <Chip 
                                label="Under Review" 
                                color="warning" 
                                size="small"
                                icon={<Schedule />}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Booking ID: #BK-2024-001 | Submitted: 2 days ago
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Payment for security services at corporate event was not processed as agreed.
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      
                      <ListItem sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Service Quality Issue
                              </Typography>
                              <Chip 
                                label="Resolved" 
                                color="success" 
                                size="small"
                                icon={<CheckCircle />}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Booking ID: #BK-2024-002 | Resolved: 1 week ago
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Guard arrived late and was not properly equipped. Issue resolved with partial refund.
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      
                      <ListItem sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Cancellation Dispute
                              </Typography>
                              <Chip 
                                label="In Progress" 
                                color="info" 
                                size="small"
                                icon={<PriorityHigh />}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Booking ID: #BK-2024-003 | Submitted: 1 day ago
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Client cancelled booking with less than 24 hours notice but refused to pay cancellation fee.
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    </List>
                    
                    {!showDisputeForm && (
                      <Box textAlign="center" sx={{ mt: 3, py: 4 }}>
                        <ReportProblem sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No Active Disputes
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          If you encounter any issues, you can raise a dispute using the button above.
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Save Button */}
          <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isLoading}
              sx={{ minWidth: 120 }}
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default SettingsPage;