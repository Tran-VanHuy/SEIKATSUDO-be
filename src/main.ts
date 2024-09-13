import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { CloudLogger } from './helpers/CloudLogger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { ValidationError } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new CloudLogger(),
  });
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const origin = [process.env.WEB_URL];
  if (process.env.LOCAL_URL) {
    origin.push(process.env.LOCAL_URL);
  }
  app.enableCors({ origin });
  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      errorFormatter: (validationErrors: ValidationError[] = []) => {
        const errors: any = {};
        validationErrors.forEach((item) => {
          if (Object.keys(item.children).length !== 0) {
            item.children.forEach((item) => {
              const { constraints, property } = item;
              errors[property] = Object.values(constraints);
            });
          } else {
            const { constraints, property } = item;
            errors[property] = Object.values(constraints);
          }
        });

        return errors;
      },
    }),
  );
  const APP_PORT = process.env.APP_PORT || 3002;
  await app.listen(APP_PORT, () => {
    Logger.log(`App listening on port ${APP_PORT}`, 'SERVER');
  });
}
bootstrap();
