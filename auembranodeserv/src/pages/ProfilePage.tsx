import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  TextField,
  ButtonGroup,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  // Divider,
  // Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  // Security,
  Star,
  LocationOn,
  Phone,
  // Email,
  // Work,
  // School,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: user?.profile?.first_name || '',
    last_name: user?.profile?.last_name || '',
    phone: user?.profile?.phone || '',
    bio: user?.profile?.bio || '',
    location: user?.profile?.location || '',
    years_experience: user?.profile?.years_experience || 0,
    hourly_rate: user?.profile?.hourly_rate || 0,
    skills: user?.profile?.skills || [],
    certifications: user?.profile?.certifications || [],
    availability: user?.profile?.availability || '',
    service_areas: user?.profile?.service_areas || [],
  });

  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newServiceArea, setNewServiceArea] = useState('');

  const isGuard = user?.user_type === 'guard';
  const isProfileComplete = user?.profile?.is_profile_complete;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // In real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      first_name: user?.profile?.first_name || '',
      last_name: user?.profile?.last_name || '',
      phone: user?.profile?.phone || '',
      bio: user?.profile?.bio || '',
      location: user?.profile?.location || '',
      years_experience: user?.profile?.years_experience || 0,
      hourly_rate: user?.profile?.hourly_rate || 0,
      skills: user?.profile?.skills || [],
      certifications: user?.profile?.certifications || [],
      availability: user?.profile?.availability || '',
      service_areas: user?.profile?.service_areas || [],
    });
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(s => s !== skill),
    });
  };

  const addCertification = () => {
    if (newCertification.trim() && !profileData.certifications.includes(newCertification.trim())) {
      setProfileData({
        ...profileData,
        certifications: [...profileData.certifications, newCertification.trim()],
      });
      setNewCertification('');
    }
  };

  const removeCertification = (cert: string) => {
    setProfileData({
      ...profileData,
      certifications: profileData.certifications.filter(c => c !== cert),
    });
  };

  const addServiceArea = () => {
    if (newServiceArea.trim() && !profileData.service_areas.includes(newServiceArea.trim())) {
      setProfileData({
        ...profileData,
        service_areas: [...profileData.service_areas, newServiceArea.trim()],
      });
      setNewServiceArea('');
    }
  };

  const removeServiceArea = (area: string) => {
    setProfileData({
      ...profileData,
      service_areas: profileData.service_areas.filter(a => a !== area),
    });
  };

  const getCompletionPercentage = () => {
    const fields = [
      profileData.first_name,
      profileData.last_name,
      profileData.phone,
      profileData.bio,
      profileData.location,
    ];
    
    if (isGuard) {
      fields.push(
        profileData.years_experience.toString(),
        profileData.hourly_rate.toString(),
        profileData.availability,
        profileData.skills.length > 0 ? 'skills' : '',
        profileData.certifications.length > 0 ? 'certs' : '',
        profileData.service_areas.length > 0 ? 'areas' : ''
      );
    }

    const completedFields = fields.filter(field => field && field !== '0').length;
    return Math.round((completedFields / fields.length) * 100);
  };

  return (
    <Layout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isGuard ? 'Manage your professional profile' : 'Manage your account information'}
            </Typography>
          </Box>
          <ButtonGroup>
            {isEditing ? (
              <>
                <Button
                  variant="contained"
                  startIcon={isLoading ? <CircularProgress size={16} /> : <Save />}
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </ButtonGroup>
        </Box>

        {/* Profile Completion Alert */}
        {!isProfileComplete && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={() => setIsEditing(true)}>
                Complete Now
              </Button>
            }
          >
            Your profile is {getCompletionPercentage()}% complete. Complete your profile to get better matches.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Overview */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box textAlign="center">
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      fontSize: '2rem',
                    }}
                  >
                    {profileData.first_name[0]}{profileData.last_name[0]}
                  </Avatar>
                  <Typography variant="h5" gutterBottom>
                    {profileData.first_name} {profileData.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {isGuard ? 'Security Professional' : 'Client'}
                  </Typography>
                  {isGuard && (
                    <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
                      <Star sx={{ color: 'warning.main', mr: 0.5 }} />
                      <Typography variant="body2">4.8 (24 reviews)</Typography>
                    </Box>
                  )}
                  <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {profileData.location || 'Location not set'}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Phone sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {profileData.phone || 'Phone not set'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Verification Status */}
            {isGuard && (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Verification Status
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Email Verified" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Background Check" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Warning color="warning" />
                      </ListItemIcon>
                      <ListItemText primary="ID Verification" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Profile Details */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Bio"
                      multiline
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Guard-specific fields */}
            {isGuard && (
              <>
                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Professional Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Years of Experience"
                          type="number"
                          value={profileData.years_experience}
                          onChange={(e) => setProfileData({ ...profileData, years_experience: parseInt(e.target.value) || 0 })}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Hourly Rate ($)"
                          type="number"
                          value={profileData.hourly_rate}
                          onChange={(e) => setProfileData({ ...profileData, hourly_rate: parseInt(e.target.value) || 0 })}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Availability"
                          value={profileData.availability}
                          onChange={(e) => setProfileData({ ...profileData, availability: e.target.value })}
                          disabled={!isEditing}
                          placeholder="e.g., Weekends, Evenings, 24/7"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Skills
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {profileData.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          onDelete={isEditing ? () => removeSkill(skill) : undefined}
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                    {isEditing && (
                      <Box display="flex" gap={1}>
                        <TextField
                          size="small"
                          placeholder="Add skill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                        />
                        <Button variant="outlined" onClick={addSkill}>
                          Add
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Certifications
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {profileData.certifications.map((cert, index) => (
                        <Chip
                          key={index}
                          label={cert}
                          onDelete={isEditing ? () => removeCertification(cert) : undefined}
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                    {isEditing && (
                      <Box display="flex" gap={1}>
                        <TextField
                          size="small"
                          placeholder="Add certification"
                          value={newCertification}
                          onChange={(e) => setNewCertification(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addCertification()}
                        />
                        <Button variant="outlined" onClick={addCertification}>
                          Add
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Service Areas
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {profileData.service_areas.map((area, index) => (
                        <Chip
                          key={index}
                          label={area}
                          onDelete={isEditing ? () => removeServiceArea(area) : undefined}
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                    {isEditing && (
                      <Box display="flex" gap={1}>
                        <TextField
                          size="small"
                          placeholder="Add service area"
                          value={newServiceArea}
                          onChange={(e) => setNewServiceArea(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addServiceArea()}
                        />
                        <Button variant="outlined" onClick={addServiceArea}>
                          Add
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default ProfilePage;
