# Aeumbra Security - React Frontend

A modern React application for the Aeumbra Security platform, providing professional security guard services with a UBER-inspired design and user experience.

## 🚀 Features

### 🔐 Authentication & User Management
- **Home/Login Page**: Clean, modern landing page with service overview
- **Registration**: Separate flows for Security Professionals and Consumers
- **User Types**: Support for Guards, Consumers, and Admin users
- **Profile Management**: Complete profile setup with verification status

### 🛡️ Security Professional Features
- **Dashboard**: Earnings overview, booking requests, and activity summary
- **Feed Page**: Share work updates, connect with community, post achievements
- **Bookings Page**: Calendar view of incoming requests with accept/reject functionality
- **Activity Page**: Earnings history, completed bookings, and performance metrics
- **Notifications**: Real-time updates for booking requests and payments

### 👥 Consumer Features
- **Dashboard**: Booking overview, spending history, and service discovery
- **Feed Page**: Browse security professionals, view their work updates
- **Booking Page**: Search and filter guards, view profiles, book services
- **Activity Page**: Booking history, reviews given, and spending analytics
- **Notifications**: Booking confirmations, payment updates, and review requests

### 👨‍💼 Admin Features
- **Pricing Management**: Configure pricing zones and multipliers
- **User Verification**: Review and approve guard applications
- **Platform Analytics**: Monitor usage and performance metrics

## 🎨 Design & UI

### UBER-Inspired Design
- **Modern Material-UI Components**: Clean, professional interface
- **Responsive Design**: Mobile-first approach with bottom navigation
- **Dark/Light Theme Support**: Configurable theme preferences
- **Professional Color Scheme**: Black, white, and accent colors

### Layout Structure
- **Left Sidebar**: Profile, settings, and admin features (desktop)
- **Bottom Navigation**: Main app navigation (mobile)
- **Top App Bar**: User profile, notifications, and quick actions
- **Card-Based Layout**: Clean, organized content presentation

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Material-UI (MUI)**: Component library and theming
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching
- **Axios**: HTTP client for API communication
- **React Hook Form**: Form management
- **Date-fns**: Date manipulation utilities

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main layout with sidebar and navigation
├── contexts/           # React contexts for state management
│   └── AuthContext.tsx # Authentication context
├── pages/             # Page components
│   ├── HomePage.tsx   # Landing page with login/register
│   ├── LoginPage.tsx # Login form
│   ├── RegisterPage.tsx # Registration for guards/consumers
│   ├── Dashboard.tsx # Main dashboard
│   ├── FeedPage.tsx  # Social feed for posts
│   ├── BookingsPage.tsx # Booking management
│   ├── ActivityPage.tsx # Activity and earnings history
│   ├── NotificationsPage.tsx # Notifications center
│   ├── ProfilePage.tsx # User profile management
│   ├── SettingsPage.tsx # App settings and preferences
│   └── AdminPricingPage.tsx # Admin pricing management
├── types/             # TypeScript type definitions
│   └── index.ts      # User, booking, and app types
├── services/          # API service functions
├── utils/            # Utility functions
└── assets/           # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd auembranodeserv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_APP_NAME=Aeumbra Security
```

### API Integration
The app is designed to work with the Python backend API. Update the API endpoints in the service files to match your backend configuration.

## 📱 User Flows

### Security Professional Flow
1. **Registration** → Complete profile → Upload documents → Verification
2. **Dashboard** → View earnings → Check booking requests
3. **Feed** → Share work updates → Build professional network
4. **Bookings** → Accept/reject requests → Manage calendar
5. **Activity** → Track earnings → View performance metrics

### Consumer Flow
1. **Registration** → Complete profile → Set preferences
2. **Dashboard** → View upcoming bookings → Check spending
3. **Feed** → Discover guards → View their work
4. **Bookings** → Search guards → Book services → Manage events
5. **Activity** → View booking history → Leave reviews

### Admin Flow
1. **Login** → Access admin dashboard
2. **Pricing Management** → Configure zones and factors
3. **User Verification** → Review guard applications
4. **Analytics** → Monitor platform usage

## 🎯 Key Features

### Authentication System
- JWT-based authentication
- Role-based access control (Guard/Consumer/Admin)
- Profile completion tracking
- Email verification flow

### Booking Management
- Real-time booking requests
- Calendar integration
- Status tracking (pending/confirmed/completed)
- Payment processing integration

### Social Features
- Professional networking
- Work updates and achievements
- Community engagement
- Review and rating system

### Admin Dashboard
- Pricing configuration
- User management
- Verification workflows
- Analytics and reporting

## 🔒 Security Features

- Secure authentication with JWT tokens
- Role-based permissions
- Input validation and sanitization
- HTTPS enforcement
- Session management

## 📊 Performance Optimizations

- Code splitting with React.lazy
- Image optimization
- Bundle size optimization
- Caching strategies
- Responsive image loading

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Vercel**: `vercel --prod`
- **Netlify**: Connect to GitHub repository
- **AWS S3**: Upload build folder to S3 bucket
- **Docker**: Use provided Dockerfile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added admin pricing management
- **v1.2.0** - Enhanced mobile experience
- **v1.3.0** - Added dispute resolution flow

---

**Built with ❤️ for the Aeumbra Security Platform**
