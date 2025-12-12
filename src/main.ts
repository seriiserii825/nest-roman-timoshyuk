import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('Transactions API')
    .setDescription('API for managing money transactions')
    .setVersion('1.0')
    .addTag('transactions')
    .addBearerAuth() // Optional: if you're using JWT
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none', // All routes collapsed
      persistAuthorization: true, // Keeps auth token on refresh
      filter: true, // Enables search box
      tagsSorter: 'alpha', // Sorts tags alphabetically
      operationsSorter: 'alpha', // Sorts operations alphabetically
    },
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет поля, которых нет в DTO
      forbidNonWhitelisted: true, // ошибка, если прислали лишнее поле
      transform: true, // включить class-transformer
      transformOptions: {
        enableImplicitConversion: true, // автоматически приводит типы
      },
    }),
  );
  
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
