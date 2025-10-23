# Security Guard Freelancing Platform - Backend API

A comprehensive FastAPI backend for a security guard freelancing platform with social features, booking system, payment processing, and more.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based permissions
- **User Management**: Complete user profiles with verification system
- **Social Features**: Posts, likes, comments, follows (Instagram-like)
- **Booking System**: Uber-like booking system for security services
- **Payment Processing**: Stripe and PayPal integration
- **Review System**: Multi-dimensional rating and review system
- **Notification System**: Email, SMS, and push notifications
- **Admin Panel**: Comprehensive admin management tools
- **Real-time Features**: WebSocket support for live updates

## 🏗️ Architecture

```
pythonbackend/
├── main.py              # FastAPI entrypoint
├── api/
│   ├── routes/          # API route handlers
│   └── dependencies/    # API dependencies
├── core/
│   ├── config.py        # Configuration settings
│   └── security.py      # Authentication & security
├── db/
│   ├── base.py          # Database base classes
│   ├── models/          # SQLAlchemy models
│   └── session.py       # Database session management
├── services/            # Business logic services
├── schemas/             # Pydantic schemas
├── tests/               # Test files
└── requirements.txt     # Python dependencies
```

## 🛠️ Installation

### Prerequisites

- Python 3.8+
- PostgreSQL 12+
- Redis (optional, for caching)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pythonbackend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment configuration**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Database setup**
   ```bash
   # Create PostgreSQL database
   createdb security_guard_app
   
   # Run migrations (if using Alembic)
   alembic upgrade head
   ```

6. **Run the application**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql+asyncpg://user:password@localhost:5432/security_guard_app` |
| `SECRET_KEY` | JWT secret key | `your-secret-key-change-in-production` |
| `ENVIRONMENT` | Environment (development/production) | `development` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |

### Database Models

The application includes comprehensive models for:
- **Users & Profiles**: Authentication and user data
- **Verification**: Document and background check system
- **Social Features**: Posts, comments, likes, follows
- **Bookings**: Event booking and management
- **Payments**: Transaction and payment method handling
- **Reviews**: Rating and review system
- **Notifications**: Multi-channel notification system
- **Complaints**: Dispute resolution system

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/{user_id}/public-profile` - Get public profile

### Social Features
- `GET /api/posts` - Get posts feed
- `POST /api/posts` - Create new post
- `POST /api/posts/{post_id}/like` - Like/unlike post
- `POST /api/posts/{post_id}/comments` - Add comment

### Bookings
- `GET /api/bookings` - Get bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/{booking_id}` - Update booking
- `POST /api/bookings/{booking_id}/confirm` - Confirm booking

### Payments
- `GET /api/payments/methods` - Get payment methods
- `POST /api/payments/methods` - Add payment method
- `POST /api/payments/process` - Process payment

### Reviews
- `GET /api/reviews` - Get reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/{review_id}` - Update review

## 🧪 Testing

```bash
# Run tests
pytest

# Run tests with coverage
pytest --cov=.

# Run specific test file
pytest tests/test_auth.py
```

## 📊 Monitoring

The application includes:
- **Health checks**: `/health` endpoint
- **Metrics**: Prometheus metrics (if enabled)
- **Logging**: Structured logging with configurable levels
- **Error tracking**: Comprehensive error handling

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt password hashing
- **Rate Limiting**: Configurable rate limiting
- **CORS Protection**: Configurable CORS settings
- **Input Validation**: Pydantic schema validation
- **SQL Injection Protection**: SQLAlchemy ORM protection

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t security-guard-api .

# Run container
docker run -p 8000:8000 security-guard-api
```

### Production Considerations

1. **Environment Variables**: Set all production environment variables
2. **Database**: Use production PostgreSQL instance
3. **Redis**: Use production Redis instance
4. **SSL**: Configure SSL/TLS certificates
5. **Monitoring**: Set up application monitoring
6. **Backups**: Configure database backups
7. **Scaling**: Use load balancers and multiple instances

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the code comments

## 🔄 Updates

### Version 1.0.0
- Initial release
- Complete API implementation
- Authentication system
- Social features
- Booking system
- Payment processing
- Review system
- Admin panel
