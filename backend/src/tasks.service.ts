import { Injectable, NotFoundException, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTaskDto, UpdateTaskDto } from './dto';
@Injectable()
export class TasksService implements OnModuleInit, OnModuleDestroy {
 private db = new PrismaClient();
 // LLM: Connect to the SQLite database when the application starts.
 async onModuleInit(){await this.db.$connect();}
 // LLM: Disconnect from SQLite during application shutdown.
 async onModuleDestroy(){await this.db.$disconnect();}
 // LLM: Return all tasks with newest tasks first.
 findAll(){return this.db.task.findMany({orderBy:{createdAt:'desc'}});}
 // LLM: Retrieve one task or return a 404 error.
 async findOne(id:string){const task=await this.db.task.findUnique({where:{id}});if(!task)throw new NotFoundException('Task not found');return task;}
 // LLM: Save a validated task with defaults in SQLite.
 create(dto:CreateTaskDto){return this.db.task.create({data:{...dto,dueDate:dto.dueDate?new Date(dto.dueDate):null}});}
 // LLM: Update an existing task and translate missing records to 404.
 async update(id:string,dto:UpdateTaskDto){try{return await this.db.task.update({where:{id},data:{...dto,dueDate:dto.dueDate===undefined?undefined:dto.dueDate===null?null:new Date(dto.dueDate)}});}catch(e){if((e as {code?:string}).code==='P2025')throw new NotFoundException('Task not found');throw e;}}
 // LLM: Delete an existing task and translate missing records to 404.
 async remove(id:string){try{await this.db.task.delete({where:{id}});}catch(e){if((e as {code?:string}).code==='P2025')throw new NotFoundException('Task not found');throw e;}}
}
