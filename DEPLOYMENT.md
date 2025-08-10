# CareerScan Deployment Guide

## Local Development Setup

### Prerequisites
- Node.js 20+
- Docker Desktop
- Android Studio
- Git

### Quick Start
1. **Run the setup script**:
   ```bash
   ./start-dev.bat  # Windows
   ```

2. **Manual setup** (if script fails):
   ```bash
   # Start services
   cd infra
   docker-compose -f docker-compose.dev.yml up -d
   
   # Setup backend
   cd ../backend
   npm install
   npx prisma migrate dev
   npx prisma generate
   npm run seed
   npm run start:dev
   ```

3. **Open Android Studio** and run the app

## Production Deployment Options

### Option 1: Render (Recommended for MVP)

1. **Database Setup**:
   - Create PostgreSQL database on Render
   - Note the connection string

2. **Backend Deployment**:
   - Connect GitHub repo to Render
   - Set build command: `cd backend && npm install && npm run build`
   - Set start command: `cd backend && npm run start:prod`
   - Environment variables:
     ```
     DATABASE_URL=postgresql://...
     JWT_ACCESS_SECRET=your-secret-key
     JWT_REFRESH_SECRET=your-refresh-key
     PORT=8080
     ```

3. **Domain Setup**:
   - Configure custom domain
   - Enable HTTPS (automatic)

### Option 2: AWS EC2 (Production Ready)

1. **Launch EC2 Instance**:
   ```bash
   # Ubuntu 22.04 LTS in ap-south-1 (Mumbai)
   # t3.medium or larger
   # Security group: 22, 80, 443, 8080
   ```

2. **Server Setup**:
   ```bash
   # Install Docker
   sudo apt update
   sudo apt install docker.io docker-compose-v2 -y
   sudo usermod -aG docker ubuntu
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install nodejs -y
   
   # Clone repository
   git clone https://github.com/yourusername/careerscan.git
   cd careerscan
   ```

3. **Production Docker Compose**:
   ```yaml
   # infra/docker-compose.prod.yml
   version: "3.9"
   services:
     db:
       image: postgres:16
       environment:
         POSTGRES_PASSWORD: ${DB_PASSWORD}
         POSTGRES_DB: careerscan
       volumes: 
         - dbdata:/var/lib/postgresql/data
       restart: unless-stopped
     
     backend:
       build: 
         context: ../backend
         dockerfile: docker/Dockerfile
       environment:
         DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@db:5432/careerscan
         JWT_ACCESS_SECRET: ${JWT_ACCESS_SECRET}
         JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
         PORT: 8080
       ports: ["8080:8080"]
       depends_on: [db]
       restart: unless-stopped
   
   volumes:
     dbdata:
   ```

4. **Environment Setup**:
   ```bash
   # Create .env file
   cat > .env << EOF
   DB_PASSWORD=your-secure-db-password
   JWT_ACCESS_SECRET=your-super-secret-access-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   EOF
   
   # Start services
   docker-compose -f infra/docker-compose.prod.yml up -d
   
   # Run migrations
   docker-compose exec backend npx prisma migrate deploy
   docker-compose exec backend npm run seed
   ```

5. **Reverse Proxy (Nginx)**:
   ```nginx
   # /etc/nginx/sites-available/careerscan
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:8080;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

6. **SSL Certificate**:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d api.yourdomain.com
   ```

### Option 3: Kubernetes (Enterprise)

1. **EKS Cluster Setup**:
   ```bash
   eksctl create cluster --name careerscan --region ap-south-1
   ```

2. **Deploy with Helm**:
   ```bash
   helm install careerscan ./infra/helm/careerscan
   ```

## Android App Deployment

### Google Play Store

1. **Prepare Release**:
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

2. **Upload to Play Console**:
   - Create app listing
   - Upload AAB file
   - Configure store listing
   - Submit for review

### Internal Distribution

1. **Firebase App Distribution**:
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools
   
   # Deploy
   firebase appdistribution:distribute app/build/outputs/apk/release/app-release.apk \
     --app YOUR_APP_ID \
     --groups testers
   ```

## Monitoring & Maintenance

### Health Monitoring
- **Uptime Robot**: Monitor `/health` endpoint
- **New Relic/DataDog**: Application performance
- **CloudWatch**: AWS infrastructure monitoring

### Backup Strategy
```bash
# Daily database backup
docker-compose exec db pg_dump -U postgres careerscan > backup-$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup-$(date +%Y%m%d).sql s3://your-backup-bucket/
```

### Log Management
```bash
# View logs
docker-compose logs -f backend

# Log rotation
sudo logrotate -f /etc/logrotate.conf
```

## Scaling Considerations

### Database Scaling
- **Read Replicas**: For read-heavy workloads
- **Connection Pooling**: PgBouncer
- **Caching**: Redis for session/query caching

### Application Scaling
- **Load Balancer**: AWS ALB or Nginx
- **Auto Scaling**: ECS/EKS with HPA
- **CDN**: CloudFront for static assets

### Performance Optimization
- **Database Indexing**: Add indexes for frequent queries
- **API Caching**: Redis for course/institution data
- **Image Optimization**: WebP format, lazy loading
- **Bundle Optimization**: Code splitting, tree shaking

## Security Checklist

- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] SSL/TLS certificates configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] CORS properly configured
- [ ] Security headers added
- [ ] Regular dependency updates
- [ ] Backup encryption enabled
- [ ] Access logs monitored

## Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   ```bash
   # Check database status
   docker-compose ps
   docker-compose logs db
   ```

2. **Migration Errors**:
   ```bash
   # Reset database (development only)
   npx prisma migrate reset
   npx prisma db push
   ```

3. **Android Network Issues**:
   - Check `usesCleartextTraffic="true"` in manifest
   - Verify API endpoint URL
   - Test with Postman/curl

4. **JWT Token Issues**:
   - Verify secret keys match
   - Check token expiration
   - Implement refresh token logic

### Performance Issues

1. **Slow API Responses**:
   - Add database indexes
   - Implement query optimization
   - Add Redis caching

2. **High Memory Usage**:
   - Optimize Docker images
   - Implement connection pooling
   - Add memory limits

## Support & Maintenance

### Regular Tasks
- **Weekly**: Check logs and metrics
- **Monthly**: Update dependencies
- **Quarterly**: Security audit
- **Annually**: Infrastructure review

### Emergency Procedures
1. **Service Down**: Check health endpoints
2. **Database Issues**: Restore from backup
3. **Security Breach**: Rotate secrets, audit logs
4. **High Load**: Scale horizontally

For additional support, check the main README.md or create an issue in the repository.