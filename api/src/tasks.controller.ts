import {
  BadRequestException, Body, Controller, Delete, Get, Headers, HttpCode,
  Param, Patch, Post, Query, Res,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TaskQuery } from './task-query';
import { TasksService } from './tasks.service';

type ResponseHeaders = { setHeader(name: string, value: string): void };

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get()
  findAll(@Query() query: TaskQuery) {
    return this.tasks.list(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res({ passthrough: true }) response: ResponseHeaders) {
    const task = await this.tasks.findOne(id);
    response.setHeader('ETag', `"${task.version}"`);
    return task;
  }

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasks.create(dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Headers('if-match') ifMatch: string | undefined,
    @Res({ passthrough: true }) response: ResponseHeaders,
  ) {
    const match = ifMatch?.match(/^"([1-9]\d*)"$/);
    if (ifMatch !== undefined && (!match || !Number.isSafeInteger(Number(match[1])))) {
      throw new BadRequestException('If-Match must contain one quoted task version.');
    }
    const task = await this.tasks.update(id, dto, match ? Number(match[1]) : undefined);
    response.setHeader('ETag', `"${task.version}"`);
    return task;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.tasks.remove(id);
  }

  @Post(':id/restore')
  @HttpCode(200)
  restore(@Param('id') id: string) {
    return this.tasks.restore(id);
  }
}
