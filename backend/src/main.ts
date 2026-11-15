import 'reflect-metadata';
import { BadRequestException, Module, ValidationPipe } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { NestFactory } from '@nestjs/core';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { FIELD_ERRORS, ProblemFilter } from './problems';
@Module({controllers:[TasksController],providers:[TasksService]})
class AppModule {}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((_request: unknown, response: { setHeader(name: string, value: string): void }, next: () => void) => {
    response.setHeader('X-Request-Id', randomUUID());
    next();
  });
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    exposedHeaders: ['ETag', 'X-Request-Id'],
  });
  app.useGlobalFilters(new ProblemFilter());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: errors => new BadRequestException({
      message: 'Check the request fields.',
      [FIELD_ERRORS]: errors.map(error => ({
        field: error.property,
        messages: Object.values(error.constraints ?? {}),
      })),
    }),
  }));
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT) || 3001, '0.0.0.0');
}
bootstrap();
