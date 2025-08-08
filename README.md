# NFT Marketplace - MERN Stack

A full-stack NFT marketplace built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, NFT creation, trading, and a modern responsive UI.

## 🚀 Features

### Core Features
- **User Authentication**: Secure registration and login with JWT tokens
- **NFT Creation**: Upload and mint unique digital assets
- **Marketplace**: Browse, buy, and sell NFTs
- **User Profiles**: View and manage user profiles with NFT collections
- **Real-time Updates**: Live updates for likes, views, and transactions
- **Search & Filter**: Advanced search and filtering capabilities
- **Responsive Design**: Mobile-first responsive design

### Technical Features
- **RESTful API**: Complete backend API with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **File Upload**: Image upload support (ready for Cloudinary integration)
- **State Management**: React Query for server state management
- **Styling**: Tailwind CSS with custom components
- **Security**: Input validation, rate limiting, and security headers

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Framer Motion** - Animation library
- **Axios** - HTTP client

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nft-marketplace
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the `backend` directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/nft-marketplace
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Cloudinary Configuration (optional)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   
   # Or start them separately:
   # Backend (from backend directory)
   npm run dev
   
   # Frontend (from frontend directory)
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
nft-marketplace/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── NFT.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── nfts.js
│   │   ├── users.js
│   │   └── marketplace.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### NFTs
- `GET /api/nfts` - Get all NFTs with filters
- `GET /api/nfts/:id` - Get NFT by ID
- `POST /api/nfts` - Create new NFT
- `PUT /api/nfts/:id` - Update NFT
- `DELETE /api/nfts/:id` - Delete NFT
- `POST /api/nfts/:id/like` - Toggle like on NFT
- `POST /api/nfts/:id/list` - List NFT for sale
- `POST /api/nfts/:id/unlist` - Unlist NFT

### Marketplace
- `POST /api/marketplace/buy/:id` - Buy NFT
- `GET /api/marketplace/stats` - Get marketplace statistics
- `GET /api/marketplace/trending` - Get trending NFTs
- `GET /api/marketplace/categories` - Get NFT categories

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/nfts` - Get user's NFTs
- `POST /api/users/:id/follow` - Follow user
- `POST /api/users/:id/unfollow` - Unfollow user
- `GET /api/users/search` - Search users

## 🎨 Features in Detail

### User Authentication
- Secure password hashing with bcrypt
- JWT token-based authentication
- Protected routes
- User profile management

### NFT Management
- Create and upload NFTs
- Set prices and royalties
- List/unlist for sale
- Like and view tracking
- Transaction history

### Marketplace Features
- Browse NFTs with filters
- Search functionality
- Category-based filtering
- Price range filtering
- Sorting options

### User Profiles
- View user collections
- Follow/unfollow users
- User statistics
- NFT ownership tracking

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Configure MongoDB connection
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the maintainers

## 🔮 Future Enhancements

- [ ] Blockchain integration (Ethereum/Polygon)
- [ ] Real-time chat system
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-chain support
- [ ] Advanced search with AI
- [ ] Social features (comments, sharing)
- [ ] Auction system
- [ ] NFT staking
- [ ] Governance tokens

---

**Happy coding! 🎉** 