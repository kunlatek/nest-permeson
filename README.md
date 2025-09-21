# Rapida Quickstart API

## Description

Rapida Quickstart is a production-ready NestJS API that provides a comprehensive foundation for building modern web applications. It includes essential features like multi-provider authentication, user profiles, workspace management, and a flexible content system.

## Features

- **🔐 Multi-Provider Authentication**
  - Google OAuth2 integration
  - Apple Sign-In support
  - JWT-based authentication
  - Local authentication with email/password

- **👤 User Management**
  - Person and Company profiles
  - Role-based access control
  - Account management
  - Profile customization

- **🏢 Workspace System**
  - Multi-tenant workspace support
  - Team collaboration features
  - Workspace-specific permissions

- **📝 Content Management**
  - Posts and content creation
  - File upload support (Google Cloud Storage)
  - Content moderation

- **🌐 Internationalization**
  - Multi-language support (English, Spanish, Portuguese)
  - Locale-aware content delivery

- **📊 Advanced Features**
  - Comprehensive logging with Winston
  - Request/response monitoring
  - Global exception handling
  - Data validation and transformation
  - API documentation with Swagger

## Technology Stack

- **Framework**: NestJS with TypeScript
- **Databases**: 
  - MongoDB (with Mongoose)
  - PostgreSQL/SQLite (with TypeORM)
- **Authentication**: Passport.js with JWT
- **File Storage**: Google Cloud Storage
- **Email**: Nodemailer with SMTP
- **SMS**: Twilio integration
- **API Documentation**: Swagger/OpenAPI
- **Logging**: Winston with daily rotation
- **Validation**: Class-validator and Class-transformer

## Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB or PostgreSQL/SQLite database
- Google Cloud Storage account (for file uploads)
- SMTP server (for email notifications)
- Twilio account (for SMS, optional)

## Project Setup

### 1. Install Dependencies

```bash
$ npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
$ cp example.env .env
```

Configure the following environment variables in your `.env` file:

```env
# Project
PROJECT_NAME=rapida-quickstart

# Authentication
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_CALLBACK_URL=http://localhost:3000/auth/apple/callback
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----

JWT_SECRET=your-secure-jwt-secret

# Database
MONGODB_URI=mongodb+srv://user:password@cluster/database

# Email
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=noreply@yourdomain.com

# Application URLs
BASE_URL=http://localhost:8080
API_BASE_URL=http://localhost:3000

# Twilio (Optional)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone

# Logging
DISCORD_WEBHOOK_URL=your-discord-webhook-url
```

### 3. Database Setup

The application supports both MongoDB and SQL databases (PostgreSQL/SQLite). Configure your preferred database in the environment variables.

## Running the Application

### Development Mode

```bash
# Start in development mode
$ npm run start

# Start in watch mode (recommended for development)
$ npm run start:dev

# Build the project
$ npm run build
```

### Production Mode

```bash
# Build and start in production mode
$ npm run build
$ npm run start:prod
```

The application will be available at:
- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api

## API Documentation

This project includes comprehensive API documentation powered by Swagger/OpenAPI. Once the application is running, you can access:

- **Interactive API Documentation**: http://localhost:3000/api
- **OpenAPI JSON**: http://localhost:3000/api-json

The Swagger UI provides:
- Complete endpoint documentation
- Request/response schemas
- Authentication testing
- Interactive API exploration

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Project Structure

```
src/
├── app.module.ts           # Main application module
├── main.ts                 # Application entry point
├── common/                 # Shared utilities and services
│   ├── guards/            # Authentication and role guards
│   ├── interceptors/      # Request/response interceptors
│   ├── filters/           # Exception filters
│   └── middleware/        # Custom middleware
├── modules/               # Feature modules
│   ├── auth/             # Authentication module
│   ├── user/             # User management
│   ├── profile/          # User profiles
│   ├── workspace/        # Workspace management
│   ├── posts/            # Content management
│   ├── account/          # Account operations
│   ├── person-profile/   # Individual profiles
│   └── company-profile/  # Company profiles
├── interfaces/           # TypeScript interfaces
├── enums/               # Application enumerations
└── utils/               # Utility functions
```

## Deployment

### Production Checklist

1. **Environment Variables**: Ensure all production environment variables are properly configured
2. **Database**: Set up production database with appropriate connection strings
3. **Security**: Configure secure JWT secrets and API keys
4. **Logging**: Set up log aggregation and monitoring
5. **File Storage**: Configure Google Cloud Storage for production

### Docker Deployment

The application can be containerized using Docker. Create a `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

### Cloud Deployment

This application is ready for deployment on:
- **AWS**: Using ECS, Lambda, or EC2
- **Google Cloud**: Using Cloud Run, App Engine, or Compute Engine
- **Azure**: Using Container Instances or App Service
- **Heroku**: Direct deployment with buildpack

## Contributing

We welcome contributions to the Rapida Quickstart API! Please follow these guidelines:

1. **Fork the repository** and create your feature branch
2. **Write tests** for any new functionality
3. **Follow the existing code style** and conventions
4. **Update documentation** as needed
5. **Submit a pull request** with a clear description of changes

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** strict mode
- **Conventional Commits** for commit messages

## Resources

Helpful resources for working with this project:

- **NestJS Documentation**: [https://docs.nestjs.com](https://docs.nestjs.com)
- **TypeORM Documentation**: [https://typeorm.io](https://typeorm.io)
- **Mongoose Documentation**: [https://mongoosejs.com](https://mongoosejs.com)
- **Passport.js Documentation**: [https://www.passportjs.org](https://www.passportjs.org)
- **Swagger/OpenAPI**: [https://swagger.io](https://swagger.io)

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify your database connection string in `.env`
   - Ensure your database server is running
   - Check firewall and network settings

2. **Authentication Issues**
   - Verify OAuth provider credentials
   - Check callback URLs match your configuration
   - Ensure JWT_SECRET is properly set

3. **File Upload Issues**
   - Verify Google Cloud Storage credentials
   - Check bucket permissions and configuration
   - Ensure proper CORS settings

### Getting Help

- Check the [Issues](../../issues) page for known problems
- Review the API documentation at `/api` when running locally
- Examine application logs in the `logs/` directory

## Support

This project is maintained by the development team at Kunlatek. For support:

- **Bug Reports**: Create an issue in the repository
- **Feature Requests**: Submit a detailed feature request
- **General Questions**: Check existing documentation first

## Stay in Touch

- **Project**: Rapida Quickstart API
- **Organization**: Kunlatek
- **License**: MIT

## License

This project is [MIT licensed](LICENSE).
