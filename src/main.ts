import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { AuthDebugMiddleware } from './common/middleware/auth-debug.middleware';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
// import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { OwnerInterceptor } from './common/interceptors/owner.interceptor';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configure static file serving for public folder
  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/public/',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(Object.values(errors?.[errors.length - 1]?.constraints)?.[Object.values(errors?.[errors.length - 1]?.constraints)?.length - 1] ?? 'Invalid request');
      },
    }),
  );

  // Register global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.use(new AuthDebugMiddleware().use);

  // app.useGlobalInterceptors(app.get(LoggingInterceptor));

  const config = new DocumentBuilder()
    .setTitle('Quickstart API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'jwt',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.useGlobalInterceptors(new OwnerInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
