import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend on localhost:5173
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept'
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,             
      forbidNonWhitelisted: false, 
      transform: true, 
      transformOptions: {
        enableImplicitConversion: true,
      },         
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();