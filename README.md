# CareerScan - End-to-End Career Guidance App

A modern, scalable career guidance application that matches users with educational institutions and courses based on personality assessment.

## Architecture

- **Backend**: Node.js + NestJS + TypeScript + PostgreSQL + Prisma
- **Android App**: Kotlin + MVVM + Jetpack Components + Retrofit
- **ML Service**: FastAPI + Python (optional personality ranking)
- **Infrastructure**: Docker + Docker Compose + GitHub Actions CI/CD

## Features

- User authentication with JWT tokens
- Personality questionnaire with A/B questions
- Rule-based personality matching (Energetic_Responder vs Deliberate_Listener)
- Course and institution recommendations
- Filtering by location, category, and persona fit
- Offline caching with Room database
- Health monitoring and observability

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Android Studio (for mobile app)
- PostgreSQL (or use Docker)

### Backend Setup

1. **Start services**:
   ```bash
   cd infra
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Setup database**:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npm run seed
   ```

4. **Start development server**:
   ```bash
   npm run start:dev
   ```

Backend will be available at `http://localhost:8080`

### Android App Setup

1. **Open in Android Studio**:
   ```bash
   cd android
   # Open in Android Studio
   ```

2. **Update API endpoint** in `NetworkModule.kt`:
   - Emulator: `http://10.0.2.2:8080/`
   - Physical device: `http://YOUR_IP:8080/`

3. **Build and run** on device/emulator

### ML Service (Optional)

```bash
cd ml/service
pip install -r requirements.txt
python main.py
```

Service available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh

### Questions
- `GET /questions` - Get active questions
- `POST /questions` - Create question (admin)

### Matching
- `POST /match/submit` - Submit questionnaire answers
- `GET /match/history/:userId` - Get user submission history

### Catalog
- `GET /catalog/institutions` - Get institutions (filterable)
- `GET /catalog/courses` - Get courses (filterable)
- `POST /catalog/institutions` - Create institution (admin)
- `POST /catalog/courses` - Create course (admin)

### Health
- `GET /health` - Health check
- `GET /health/ready` - Readiness check

## Database Schema

### Core Models
- **User**: Authentication and profile data
- **Question**: Questionnaire items with A/B options
- **Submission**: User answers and calculated persona
- **Institution**: Educational institutions (150+ seeded)
- **Course**: Available courses with persona fit mapping
- **Profile**: User personality profiles

## Deployment

### Local Development
```bash
docker-compose -f infra/docker-compose.dev.yml up
```

### Production Options

1. **Managed Platforms** (Recommended):
   - Render/Railway for backend
   - Managed PostgreSQL
   - GitHub Actions for CI/CD

2. **Self-hosted**:
   - AWS EC2 in ap-south-1 (Mumbai)
   - Docker containers
   - RDS for PostgreSQL

3. **Kubernetes** (Advanced):
   - EKS/GKE cluster
   - Helm charts
   - Auto-scaling

## CI/CD Pipeline

GitHub Actions workflows:
- **Backend CI**: Test, build, push Docker image
- **Android CI**: Build and test Android app
- **Deploy**: Automated deployment to production

## Monitoring & Observability

- Health check endpoints
- Structured JSON logging
- Request/response logging
- Database connection monitoring
- Uptime monitoring with external services

## Security

- Password hashing with Argon2
- JWT access/refresh token rotation
- Input validation with Zod
- Rate limiting
- CORS protection
- Helmet security headers

## Performance & Accuracy

- **Target Accuracy**: >40% improvement in guidance selection
- **Uptime Target**: 99.5%
- **Response Time**: <500ms for API calls
- **Offline Support**: Room database caching
- **Retry Logic**: Exponential backoff for network calls

## Scaling Considerations

- Horizontal scaling with load balancers
- Database read replicas
- Redis caching layer
- CDN for static assets
- Auto-scaling based on CPU/memory

## Development Workflow

1. **Feature Development**:
   - Create feature branch
   - Implement backend API
   - Add Android UI
   - Write tests
   - Create PR

2. **Testing**:
   - Unit tests (Jest for backend)
   - Integration tests
   - Android instrumentation tests
   - Manual testing

3. **Deployment**:
   - Merge to main
   - Automated CI/CD pipeline
   - Database migrations
   - Health checks

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review and merge

## License

Private - All rights reserved

## Support

For issues and questions:
- Create GitHub issue
- Check documentation
- Review API endpoints with Swagger/OpenAPI docs at `/docs`