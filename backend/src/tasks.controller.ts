import { Body, Controller, Get, Post, Patch, Delete, Param, HttpCode } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
@Controller('tasks')
export class TasksController {
 // LLM: Inject the task service used by each REST endpoint.
 constructor(private readonly tasks:TasksService){}
 // LLM: List every saved task.
 @Get() findAll(){return this.tasks.findAll();}
 // LLM: Return a single task by its identifier.
 @Get(':id') findOne(@Param('id') id:string){return this.tasks.findOne(id);}
 // LLM: Create a task from a validated request body.
 @Post() create(@Body() dto:CreateTaskDto){return this.tasks.create(dto);}
 // LLM: Apply validated changes to a task.
 @Patch(':id') update(@Param('id') id:string,@Body() dto:UpdateTaskDto){return this.tasks.update(id,dto);}
 // LLM: Delete a task and return an empty success response.
 @Delete(':id') @HttpCode(204) remove(@Param('id') id:string){return this.tasks.remove(id);}
}

