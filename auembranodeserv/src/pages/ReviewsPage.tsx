import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Rating,
  Chip,
  Button,
  Paper,
} from '@mui/material';
import {
  Star,
  StarBorder,
  RateReview,
  ThumbUp,
  ThumbDown,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

interface Review {
  id: string;
  reviewer: {
    name: string;
    avatar?: string;
    initials: string;
  };
  reviewee: {
    name: string;
    avatar?: string;
    initials: string;
  };
  rating: number;
  comment: string;
  date: string;
  service: string;
  helpful: number;
}

const ReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const isGuard = user?.user_type === 'guard';

  // Mock data for reviews
  const reviewsWritten: Review[] = [
    {
      id: '1',
      reviewer: { name: user?.profile?.first_name + ' ' + user?.profile?.last_name || 'You', initials: 'Y' },
      reviewee: { name: 'Mike Johnson', initials: 'M' },
      rating: 5,
      comment: 'Excellent service, very professional and punctual. Would definitely hire again.',
      date: '2 days ago',
      service: 'Corporate Event Security',
      helpful: 3,
    },
    {
      id: '2',
      reviewer: { name: user?.profile?.first_name + ' ' + user?.profile?.last_name || 'You', initials: 'Y' },
      reviewee: { name: 'Sarah Williams', initials: 'S' },
      rating: 4,
      comment: 'Good security service, arrived on time and handled everything professionally.',
      date: '1 week ago',
      service: 'Wedding Security',
      helpful: 2,
    },
  ];

  const reviewsReceived: Review[] = [
    {
      id: '3',
      reviewer: { name: 'Sarah Williams', initials: 'S' },
      reviewee: { name: user?.first_name + ' ' + user?.last_name || 'You', initials: 'Y' },
      rating: 5,
      comment: 'Outstanding security service for our corporate event. Very professional and reliable.',
      date: '1 week ago',
      service: 'Corporate Event Security',
      helpful: 5,
    },
    {
      id: '4',
      reviewer: { name: 'John Smith', initials: 'J' },
      reviewee: { name: user?.first_name + ' ' + user?.last_name || 'You', initials: 'Y' },
      rating: 5,
      comment: 'Amazing service! The guard was very attentive and made us feel safe throughout the event.',
      date: '2 weeks ago',
      service: 'Private Party Security',
      helpful: 4,
    },
    {
      id: '5',
      reviewer: { name: 'Emily Brown', initials: 'E' },
      reviewee: { name: user?.first_name + ' ' + user?.last_name || 'You', initials: 'Y' },
      rating: 4,
      comment: 'Professional service, good communication, and handled the security requirements well.',
      date: '3 weeks ago',
      service: 'Office Building Security',
      helpful: 3,
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const calculateOverallRating = () => {
    if (reviewsReceived.length === 0) return 0;
    const totalRating = reviewsReceived.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviewsReceived.length).toFixed(1);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'success';
    if (rating >= 3.5) return 'warning';
    return 'error';
  };

  const renderStars = (rating: number) => {
    return (
      <Box display="flex" alignItems="center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            sx={{
              fontSize: 16,
              color: star <= rating ? 'warning.main' : 'grey.400',
            }}
          />
        ))}
      </Box>
    );
  };

  const renderReviewCard = (review: Review, isReceived: boolean = false) => (
    <Card key={review.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ mr: 2, backgroundColor: 'primary.main' }}>
              {isReceived ? review.reviewer.initials : review.reviewee.initials}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {isReceived ? review.reviewer.name : review.reviewee.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {review.service}
              </Typography>
            </Box>
          </Box>
          <Box textAlign="right">
            <Box display="flex" alignItems="center" sx={{ mb: 0.5 }}>
              {renderStars(review.rating)}
              <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>
                {review.rating}/5
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {review.date}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body2" sx={{ mb: 2 }}>
          {review.comment}
        </Typography>
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Chip
            label={`${review.helpful} helpful`}
            size="small"
            icon={<ThumbUp sx={{ fontSize: 14 }} />}
            variant="outlined"
          />
          <Box>
            <Button size="small" startIcon={<ThumbUp />}>
              Helpful
            </Button>
            <Button size="small" startIcon={<ThumbDown />}>
              Not Helpful
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Reviews
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {isGuard 
            ? 'Manage your reviews and build your professional reputation'
            : 'View reviews you\'ve given and received for security services'
          }
        </Typography>

        {/* Overall Rating Highlight */}
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <Star sx={{ fontSize: 48, mr: 2, color: 'white' }} />
                <Box>
                  <Typography variant="h3" fontWeight="bold">
                    {calculateOverallRating()}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Overall Rating
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Based on {reviewsReceived.length} review{reviewsReceived.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box textAlign="right">
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Rating Breakdown
                </Typography>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviewsReceived.filter(r => r.rating === rating).length;
                  const percentage = reviewsReceived.length > 0 ? (count / reviewsReceived.length) * 100 : 0;
                  return (
                    <Box key={rating} display="flex" alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 20, mr: 1 }}>
                        {rating}
                      </Typography>
                      <Star sx={{ fontSize: 16, mr: 1 }} />
                      <Box sx={{ flexGrow: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 1, mr: 1 }}>
                        <Box 
                          sx={{ 
                            height: '100%', 
                            backgroundColor: 'white', 
                            borderRadius: 1,
                            width: `${percentage}%`,
                            transition: 'width 0.3s ease'
                          }} 
                        />
                      </Box>
                      <Typography variant="body2" sx={{ minWidth: 30 }}>
                        {count}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab 
              label={`Reviews Written (${reviewsWritten.length})`} 
              icon={<RateReview />}
              iconPosition="start"
            />
            <Tab 
              label={`Reviews Received (${reviewsReceived.length})`} 
              icon={<Star />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Reviews Written Tab */}
        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Reviews You've Written
            </Typography>
            {reviewsWritten.length > 0 ? (
              reviewsWritten.map((review) => renderReviewCard(review, false))
            ) : (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <StarBorder sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Reviews Written Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You haven't written any reviews yet. Reviews help build trust in the community.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {/* Reviews Received Tab */}
        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Reviews You've Received
            </Typography>
            {reviewsReceived.length > 0 ? (
              reviewsReceived.map((review) => renderReviewCard(review, true))
            ) : (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <StarBorder sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Reviews Received Yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You haven't received any reviews yet. Complete bookings to start building your reputation.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default ReviewsPage;
