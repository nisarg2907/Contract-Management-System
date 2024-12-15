# 📜 Contract Management System

## 🔗 Repository
**GitHub Repository**: [git@github.com:nisarg2907/Contract-Management-System.git](git@github.com:nisarg2907/Contract-Management-System.git)

## 🌐 Deployment
**Live Demo**: [http://34.47.176.131:3000](http://34.47.176.131:3000)

**Test Credentials**:
- **Email**: shahnmn604@gmail.com
- **Password**: 123456

## 🔧 Quick Setup Guide

### Prerequisites
- Node.js (Latest LTS)
- npm
- PostgreSQL

### Installation Steps

1. Clone the Repository
   ```bash
   git clone git@github.com:nisarg2907/Contract-Management-System.git
   cd Contract-Management-System
   ```

2. Install Dependencies
   ```bash
   npm install
   ```

3. Setup Environment Variables
   Create a `.env` file with the following variables:
   ```
   # Option 1: Use the provided Supabase database credentials
   DATABASE_URL="postgresql://postgres.psklkoyyaygprqqnholi:L2VBgSPbRH4rtLVh@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.psklkoyyaygprqqnholi:L2VBgSPbRH4rtLVh@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
   
   # Option 2: Or use your own database connection
   # DATABASE_URL=your_database_connection_string
   # DIRECT_URL=your_direct_database_connection

   NEXT_PUBLIC_BACKEND_URL=http://localhost:3000/
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run Database Migrations
   ```bash
   npx prisma migrate dev
   ```

5. Start Development Server
   ```bash
   npm run dev
   ```

## 🚀 Project Overview

This is a Full-Stack Engineering Assignment demonstrating a comprehensive Contract Management System built with modern web technologies. The application provides a robust solution for managing and tracking contracts with real-time updates and advanced features.

### 🎯 Project Objectives

- Build a scalable web application
- Implement efficient API integrations
- Develop real-time feature tracking
- Create a user-friendly contract management interface

## 🛠 Technology Stack

- **Frontend**: Next.js 15 (App Router)
- **Backend**: Node.js with Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Real-Time Communication**: Socket.io
- **UI Components**: Shadcn UI
- **Form Management**: React Hook Form
- **Validation**: Zod

## ✨ Features

### Frontend Capabilities
- Contract data upload (text/JSON)
- Comprehensive contract listing
- Advanced search and filtering
- Real-time contract status updates
- Column toggling and data export
- Responsive and modern UI

### Backend Functionality
- RESTful API endpoints
- Contract CRUD operations
- Pagination support
- Advanced filtering
- Socket.io real-time notifications

## 🚦 System Architecture

```
project-structure/
│
├── app/                # Next.js application routes
│   ├── api/            # REST API endpoints
│   └── contracts/      # Contract management pages
│
├── pages/
│   └── api/socket/io/  # Socket.io server configuration
│
├── components/         # Reusable React components
├── lib/                # Utility functions
└── prisma/             # Database schema
```

## 🔐 Authentication

Supports multiple authentication methods:
- Email/Password login
- Secure NextAuth.js integration

## 📦 Database Schema

### Tables
- **Users**: User account management
- **Contracts**: Contract detailed information
- **Notifications**: Real-time update tracking

## 🛢 Database Configuration

Connected to Supabase PostgreSQL with Prisma ORM, ensuring:
- Efficient querying
- Strong type safety
- Easy database migrations

## 🌟 Key Technologies

- **Next.js 15**: Modern React framework
- **Prisma**: Type-safe ORM
- **Shadcn UI**: Beautifully designed components
- **Socket.io**: Real-time communication
- **Zod**: TypeScript-first schema validation

## 🔍 API Endpoints

- `/api/contracts`: CRUD operations
- `/api/notifications`: Notifications get/patch 
- `/api/users`: User management
- `/api/socket/io`: Real-time updates

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## ⚠️ Important Note

The provided database credentials are for review and testing purposes. It is recommended to use these credentials only during the initial setup and review process. For production or long-term use, set up your own database and update the connection strings accordingly.