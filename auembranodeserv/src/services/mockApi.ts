// Mock API for demonstration when backend is not available
export const mockApi = {
  // Mock authentication responses
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: {
        access_token: 'mock_access_token_' + Date.now(),
        refresh_token: 'mock_refresh_token_' + Date.now(),
        token_type: 'bearer',
        expires_in: 3600,
        user: {
          id: 1,
          email: email,
          user_type: 'consumer',
          is_verified: true,
          is_active: true,
          first_name: 'John',
          last_name: 'Doe',
          phone_number: '+1234567890',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    };
  },

  register: async (userData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      access_token: 'mock_access_token_' + Date.now(),
      refresh_token: 'mock_refresh_token_' + Date.now(),
      token_type: 'bearer',
      expires_in: 3600
    };
  },

  getCurrentUser: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: 1,
      email: 'demo@aeumbra.com',
      user_type: 'consumer',
      is_verified: true,
      is_active: true,
      first_name: 'Demo',
      last_name: 'User',
      phone_number: '+1234567890',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  },

  getPosts: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        user: {
          name: 'Security Guard Pro',
          avatar: '/aeumbre-icon.png'
        },
        title: 'Professional Security Services',
        rating: 4.8,
        content: 'Experienced security guard available for events, parties, and corporate functions. 5+ years experience in the field.',
        images: ['/aeumbra1.png'],
        likes: 24,
        comments: 8,
        timeAgo: '2 hours ago',
        location: 'Downtown Area',
        isLiked: false
      },
      {
        id: '2',
        user: {
          name: 'Event Security Solutions',
          avatar: '/aeumbre-icon.png'
        },
        title: 'Wedding Security Services',
        rating: 4.9,
        content: 'Specialized in wedding security with experience in handling large gatherings. Professional, reliable, and discreet.',
        images: [],
        likes: 18,
        comments: 5,
        timeAgo: '4 hours ago',
        location: 'Suburban Area',
        isLiked: true
      }
    ];
  },

  getBookings: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        event_type: 'Wedding',
        event_date: '2024-02-14',
        start_time: '18:00',
        end_time: '23:00',
        location: 'Grand Hotel Ballroom',
        description: 'Wedding reception security',
        status: 'pending',
        total_amount: 500,
        created_at: new Date().toISOString()
      }
    ];
  },

  getNotifications: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 1,
        type: 'booking_request',
        title: 'New Booking Request',
        message: 'You have received a new booking request for wedding security.',
        is_read: false,
        created_at: new Date().toISOString()
      }
    ];
  }
};

// Check if we should use mock API
export const shouldUseMockApi = () => {
  const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://aeumbra-backend.railway.app/api/v1';
  return apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');
};
