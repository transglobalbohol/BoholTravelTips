# Guide to Bohol - Tourism Marketplace Website

A comprehensive tourism marketplace website for Bohol, Philippines, built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This platform allows travelers to discover, book, and manage tours and accommodations across the beautiful island of Bohol.

![Guide to Bohol](https://images.unsplash.com/photo-1544986581-efac024faf62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

## Features

### For Travelers
- **Browse Tours & Activities**: Discover amazing tours from Chocolate Hills to island hopping adventures
- **Hotel Bookings**: Find and book accommodations from budget-friendly to luxury resorts
- **User Authentication**: Secure registration and login system
- **Booking Management**: Track and manage your bookings from a personalized dashboard
- **Reviews & Ratings**: Read and write reviews for tours and hotels
- **Wishlist**: Save favorite tours and hotels for future bookings
- **Search & Filters**: Advanced search with filters for price, category, location, and more
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices

### For Business Owners
- **Partner Dashboard**: Manage your tour and hotel listings
- **Booking Management**: Track and confirm customer bookings
- **Analytics**: View performance metrics and booking statistics
- **Content Management**: Update tour details, pricing, and availability

### Technical Features
- **Modern MERN Stack**: MongoDB, Express.js, React.js with TypeScript, Node.js
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Real-time Updates**: Dynamic content updates and booking confirmations
- **Payment Integration**: Ready for payment gateway integration (Stripe, PayPal, PayMongo)
- **SEO Optimized**: Search engine friendly URLs and meta tags
- **API-First Design**: RESTful API architecture for scalability

## Technology Stack

### Frontend
- **React.js 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for responsive and modern UI design
- **React Router DOM** for client-side routing
- **Axios** for HTTP requests
- **React Hook Form** for form handling and validation
- **Context API** for state management

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM for data modeling
- **JWT** for authentication and authorization
- **bcrypt** for password hashing
- **Express Validator** for input validation
- **Multer** for file uploads
- **Helmet** for security headers
- **CORS** for cross-origin resource sharing

### Development Tools
- **ESLint & Prettier** for code linting and formatting
- **Git** for version control
- **Environment Variables** for configuration management

## Project Structure

```
guidetobohol/
├── Frontend/                 # React.js + TypeScript
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Homepage/    # Homepage-specific components
│   │   │   └── Layout/      # Layout components (Header, Footer)
│   │   ├── pages/           # Route components
│   │   │   └── Auth/        # Authentication pages
│   │   ├── context/         # React Context providers
│   │   ├── services/        # API service functions
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions and constants
│   │   └── assets/          # Images, icons, fonts
│   ├── package.json
│   └── vite.config.ts
└── Backend/                 # Node.js + Express.js
    ├── controllers/         # Request handlers
    ├── models/             # MongoDB schemas
    ├── routes/             # API route definitions
    ├── middleware/         # Custom middleware
    ├── config/             # Configuration files
    ├── uploads/            # File upload directory
    ├── package.json
    └── server.js
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Compass)
- Git
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ampere07/GuidetoBohol.git
   cd guide-to-bohol
   ```

2. **Set up the Backend**
   ```bash
   cd Backend
   pnpm install
   
   # Create and configure environment variables
   cp .env.example .env
   # Edit .env with your MongoDB connection and other settings
   ```

3. **Set up the Frontend**
   ```bash
   cd ../Frontend
   pnpm install
   ```

4. **Start MongoDB**
   - **Option 1**: Using MongoDB Compass
     - Open MongoDB Compass
     - Connect to `mongodb://localhost:27017`
   - **Option 2**: Using MongoDB Service
     ```bash
     # Windows
     net start MongoDB
     
     # macOS
     brew services start mongodb-community
     
     # Linux
     sudo systemctl start mongod
     ```

5. **Start the Development Servers**
   
   **Backend** (Terminal 1):
   ```bash
   cd Backend
   pnpm run dev
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   cd Frontend
   pnpm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## ⚙️ Configuration

### Backend Environment Variables (.env)
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/guidetobohol

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
NODE_ENV=development
PORT=5000

# Client Configuration
CLIENT_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=10MB
UPLOAD_DIR=uploads
```

### Frontend Configuration
The frontend automatically adapts to development/production environments. Update `src/utils/constants.ts` for custom configurations.

## 🗃️ Database Structure

### Collections
- **Users**: User accounts and authentication
- **Tours**: Tour listings with details, pricing, and availability
- **Hotels**: Hotel and accommodation listings
- **Bookings**: Reservation records and booking management
- **Reviews**: Customer reviews and ratings
- **Categories**: Tour and hotel categorization

### Key Features
- **Indexing**: Optimized queries for search and filtering
- **Relationships**: Proper data relationships using MongoDB ObjectIds
- **Validation**: Schema-level validation for data integrity

## 📱 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Tours Endpoints
- `GET /api/tours` - Get all tours with optional filters
- `GET /api/tours/:id` - Get tour by ID
- `GET /api/tours/featured` - Get featured tours
- `GET /api/tours/search` - Search tours
- `POST /api/tours` - Create new tour (admin/partner only)
- `PUT /api/tours/:id` - Update tour (admin/partner only)

### Hotels Endpoints
- `GET /api/hotels` - Get all hotels with optional filters
- `GET /api/hotels/:id` - Get hotel by ID
- `GET /api/hotels/featured` - Get featured hotels
- `POST /api/hotels` - Create new hotel (admin/partner only)

### Bookings Endpoints
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user` - Get user's bookings (protected)
- `GET /api/bookings/:id` - Get booking by ID (protected)
- `PUT /api/bookings/:id` - Update booking (protected)
- `POST /api/bookings/:id/cancel` - Cancel booking (protected)

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the application: `pnpm run build`
2. Deploy the `dist` folder to your hosting provider
3. Configure environment variables for production

### Backend Deployment (Railway/Render/Heroku)
1. Ensure all dependencies are in `package.json`
2. Set up environment variables in your hosting provider
3. Configure MongoDB Atlas for production database
4. Deploy the backend code

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Configure network access and database users
3. Update `MONGODB_URI` in production environment

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd Backend
pnpm test

# Frontend tests
cd Frontend
pnpm test
```

### Test Coverage
- Unit tests for utility functions
- Integration tests for API endpoints
- Component tests for React components

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the coding standards
4. Test your changes thoroughly
5. Commit your changes: `git commit -m "Add your feature"`
6. Push to your branch: `git push origin feature/your-feature-name`
7. Create a Pull Request

### Coding Standards
- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write clear, descriptive commit messages
- Add comments for complex logic
- Ensure responsive design for all UI changes

## 📞 Support

### Documentation
- [API Documentation](docs/api.md)
- [Component Library](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### Getting Help
- 📧 Email: support@guidetobohol.ph
- 💬 GitHub Issues: Create an issue for bug reports or feature requests
- 📱 Phone: +63 123 456 7890

### Community
- Follow us on social media for updates
- Join our developer community discussions
- Contribute to our open-source initiatives

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Bohol Tourism Industry**: For inspiration and local insights
- **Open Source Community**: For the amazing tools and libraries
- **Contributors**: Everyone who has contributed to this project
- **Early Users**: Beta testers and feedback providers

## 🎯 Future Roadmap

### Upcoming Features
- [ ] Mobile Applications (iOS & Android)
- [ ] Multi-language Support (Filipino, Spanish, Chinese)
- [ ] Advanced Analytics Dashboard
- [ ] AI-Powered Tour Recommendations
- [ ] Real-time Chat Support
- [ ] Virtual Tour Integration
- [ ] Social Media Integration
- [ ] Loyalty Program and Rewards

### Technical Improvements
- [ ] Performance Optimization
- [ ] Enhanced SEO Features
- [ ] Progressive Web App (PWA)
- [ ] Advanced Caching Strategies
- [ ] Microservices Architecture
- [ ] GraphQL API Implementation

---

**Guide to Bohol** - Discover the Heart of the Philippines 🇵🇭

Made with ❤️ in Bohol, Philippines