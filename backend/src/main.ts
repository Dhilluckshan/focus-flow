import 'reflect-metadata';
import { Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
@Module({controllers:[TasksController],providers:[TasksService]})
class AppModule {}
async function bootstrap(){const app=await NestFactory.create(AppModule);app.enableCors({origin:process.env.FRONTEND_ORIGIN || 'http://localhost:3000'});app.useGlobalPipes(new ValidationPipe({transform:true,whitelist:true,forbidNonWhitelisted:true}));app.enableShutdownHooks();await app.listen(Number(process.env.PORT)||3001,'0.0.0.0');}
bootstrap();
