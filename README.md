# 🛡️ Friends Associates - Insurance Management Platform

A comprehensive full-stack insurance management system built for insurance agencies to manage policies, leads, customers, and provide real-time customer support. The platform features separate dashboards for customers and administrators with advanced analytics, policy tracking, and communication tools.

![Next.js](https://img.shields.io/badge/Next.js-16.0.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-8.20.1-green?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=for-the-badge&logo=react)

## ✨ Features

### Customer Features
- **User Registration & Authentication** - Secure signup/login with email verification
- **Quote Request System** - Submit insurance quotes with vehicle and personal details
- **Policy Management** - View all active policies with expiry dates and policy documents
- **Vehicle Management** - Track and manage registered vehicles
- **Real-time Chat Support** - Direct messaging with admin support team
- **Profile Management** - Update personal information and preferences

### Admin Features
- **Comprehensive Dashboard** - Analytics with interactive charts (bar, pie, line charts)
- **Policy Management** - Create, update, and track insurance policies with expiry monitoring
- **Lead Management** - Track and manage quote requests with status updates
- **User Management** - Create and manage customer accounts
- **Vehicle Management** - Add and track customer vehicles
- **Real-time Messaging** - Communicate with customers through integrated chat system
- **Automated Reminders** - Cron jobs for policy expiry notifications
- **Advanced Filtering** - Search and filter policies by type, status, and expiry date

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **Email**: Nodemailer for notifications and verification
- **Charts**: Recharts for data visualization
- **UI Components**: Lucide React icons, React Hot Toast
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB database (local or cloud like MongoDB Atlas)
- Email service credentials (Gmail, SendGrid, etc.)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/friends_associates.git
   cd friends_associates
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ADMIN_JWT_SECRET=your_admin_jwt_secret_key
   
   # Email Configuration (Gmail example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=your_email@gmail.com
   
   # Optional: For production
   NODE_ENV=production
   ```

4. **Set up admin account**
   ```bash
   npm run create-admin
   # Follow the prompts to create an admin account
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
friends_associates/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── chat/          # Chat API
│   │   │   ├── leads/         # Lead management
│   │   │   ├── policies/     # Policy management
│   │   │   ├── vehicles/      # Vehicle management
│   │   │   └── users/         # User management
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── admin/         # Admin dashboard
│   │   │   └── user/         # User dashboard
│   │   ├── login/            # Login pages
│   │   └── page.tsx          # Home page
│   ├── components/            # React components
│   │   ├── AdminAnalytics.tsx
│   │   ├── ChatWidget.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── QuoteForm.tsx
│   ├── lib/                   # Utility functions
│   │   ├── auth.ts           # Authentication helpers
│   │   ├── db.ts             # Database connection
│   │   └── email.ts          # Email utilities
│   └── models/                # Mongoose models
│       ├── Admin.ts
│       ├── Chat.ts
│       ├── Lead.ts
│       ├── Policy.ts
│       ├── User.ts
│       └── Vehicle.ts
├── scripts/                   # Utility scripts
│   ├── create-admin.ts
│   ├── seed-admin.ts
│   └── verify-admin.ts
├── public/                    # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/user/register` - User registration
- `POST /api/auth/user/login` - User login
- `POST /api/auth/user/verify` - Email verification
- `POST /api/auth/user/forgot-password` - Password reset request
- `POST /api/auth/user/reset-password` - Reset password
- `POST /api/auth/admin/login` - Admin login

### Policies
- `GET /api/policies` - Get all policies (filtered by user for customers)
- `POST /api/policies` - Create new policy (admin only)
- `PUT /api/policies` - Update policy (admin only)

### Leads
- `GET /api/leads` - Get all leads (admin only)
- `POST /api/leads` - Create new lead (quote request)
- `PUT /api/leads` - Update lead status (admin only)

### Vehicles
- `GET /api/vehicles` - Get all vehicles (filtered by user for customers)
- `POST /api/vehicles` - Add new vehicle (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create new user (admin only)
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update user profile

### Chat
- `GET /api/chat` - Get chat messages
- `POST /api/chat` - Send message

### Cron Jobs
- `GET /api/cron/reminders` - Send policy expiry reminders (automated)

## 🎨 Features in Detail

### Analytics Dashboard
- **Policy Status Overview** - Visual representation of active, expired, and expiring policies
- **Vehicle Type Distribution** - Pie chart showing distribution of vehicle types
- **Monthly Policy Trends** - Line chart tracking policy creation over time
- **Lead Statistics** - Total leads and conversion metrics
- **Top Users** - Identify most active customers

### Real-time Chat
- Bidirectional messaging between customers and admins
- Message history persistence
- Auto-refresh for new messages
- Real-time updates with polling mechanism

### Policy Management
- Track policy expiry dates
- Automated reminders via cron jobs
- Policy document links (Google Drive, etc.)
- Status tracking (Active, Expiring Soon, Expired)
- Advanced filtering and search

