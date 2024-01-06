import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import {
  i18nValidationErrorFactory,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  app.enableCors(); // To enable CORS

  // To whitelist unnecessary fields
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: i18nValidationErrorFactory,
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  // To enable app versioning on global level
  /*
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: process.env.API_VERSION || '1',
  });
  */

  // Helmet added for HSTS policy
  app.use(helmet.strictTransportSecurity());
  // https://www.educative.io/answers/how-can-we-add-http-security-headers-using-helmetjs
  // https://helmetjs.github.io/#strict-transport-security

  // To enable swagger
  if (process.env.STACK_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Analysis audio app')
      .setDescription('Analysis audio Client app')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('nestjs ')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(process.env.PORT ? process.env.PORT : 3000, () => {
    console.log(
      `Server Initialized on port ${
        process.env.PORT ? process.env.PORT : 3000
      }`,
    );
  });
}
bootstrap();
