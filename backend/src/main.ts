import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: [/^http:\/\/localhost:\d+$/, /^https:\/\/.*\.yourdomain\.com$/],
    credentials: true
  });
  app.use(rateLimit({ windowMs: 60_000, max: 120 }));
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
