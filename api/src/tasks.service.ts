import { BadRequestException, HttpException, Injectable, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient, Task } from '@prisma/client';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { TaskQuery } from './task-query';

function toTask({ deletedAt: _deletedAt, ...task }: Task) {
  return task;
}

@Injectable()
export class TasksService implements OnModuleInit, OnModuleDestroy {
  private readonly db = new PrismaClient();

  async onModuleInit() {
    await this.db.$connect();
    await this.db.$queryRaw`PRAGMA journal_mode = WAL`;
  }

  async onModuleDestroy() {
    await this.db.$disconnect();
  }

  async list(query: TaskQuery) {
    const search = query.search?.trim();
    const where: Prisma.TaskWhereInput = {
      deletedAt: null,
      status: query.status,
      OR: search ? [
        { title: { contains: search } },
        { description: { contains: search } },
        { project: { contains: search } },
      ] : undefined,
    };
    const direction = query.direction ?? 'desc';
    const orderBy: Prisma.TaskOrderByWithRelationInput[] = query.sort === 'dueDate'
      ? [{ dueDate: { sort: direction, nulls: 'last' } }, { id: direction }]
      : [{ createdAt: direction }, { id: direction }];

    if (Object.values(query).every(value => value === undefined)) {
      return (await this.db.task.findMany({ where, orderBy })).map(toTask);
    }

    const limit = query.limit ?? 20;
    const cursor = query.cursor;
    return this.db.$transaction(async db => {
      if (cursor && !await db.task.findFirst({ where: { ...where, id: cursor }, select: { id: true } })) {
        throw new BadRequestException('Cursor does not match the current task filters.');
      }
      const rows = await db.task.findMany({
        where, orderBy, take: limit + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });
      const items = rows.slice(0, limit).map(toTask);
      return {
        items,
        total: await db.task.count({ where }),
        nextCursor: rows.length > limit ? items[limit - 1].id : null,
      };
    });
  }

  async findOne(id: string) {
    const task = await this.db.task.findUnique({ where: { id, deletedAt: null } });
    if (!task) throw new NotFoundException('Task not found');
    return toTask(task);
  }

  async create(dto: CreateTaskDto) {
    const task = await this.db.task.create({
      data: { ...dto, dueDate: dto.dueDate ? new Date(dto.dueDate) : null },
    });
    return toTask(task);
  }

  async update(id: string, dto: UpdateTaskDto, version?: number) {
    const { dueDate, ...fields } = dto;
    try {
      const task = await this.db.task.update({
        where: { id, deletedAt: null, version },
        data: {
          ...fields,
          dueDate: dueDate ? new Date(dueDate) : dueDate,
          version: { increment: 1 },
        },
      });
      return toTask(task);
    } catch (error) {
      if (!this.isMissing(error)) throw error;
      if (version !== undefined) {
        await this.findOne(id);
        throw new HttpException('Task changed since it was loaded.', 412);
      }
      throw new NotFoundException('Task not found');
    }
  }

  async remove(id: string) {
    try {
      await this.db.task.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date(), version: { increment: 1 } },
      });
    } catch (error) {
      if (this.isMissing(error)) throw new NotFoundException('Task not found');
      throw error;
    }
  }

  async restore(id: string) {
    try {
      const task = await this.db.task.update({
        where: { id, deletedAt: { not: null } },
        data: { deletedAt: null, version: { increment: 1 } },
      });
      return toTask(task);
    } catch (error) {
      if (this.isMissing(error)) throw new NotFoundException('Deleted task not found');
      throw error;
    }
  }

  private isMissing(error: unknown) {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
  }
}
