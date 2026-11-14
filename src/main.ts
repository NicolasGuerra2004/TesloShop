import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Teslo RESTful API')
    .setDescription(
      'REST API for managing users, authentication, products, and catalog images for Teslo Shop.',
    )
    .setVersion('1.0')
    .setContact(
      'Teslo Shop',
      'https://github.com/NicolasGuerra2004/TesloShop',
      '',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:         'Enter the JWT token obtained from /api/auth/login.',
      },
      'access-token',
    )
    .addServer(`http://localhost:${process.env.PORT ?? 3000}`, 'Local development')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    customSiteTitle: 'Teslo Shop API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      docExpansion: 'list',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
