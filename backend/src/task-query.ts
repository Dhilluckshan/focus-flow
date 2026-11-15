import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { Status } from '@prisma/client';

export class TaskQuery {
  @IsOptional() @IsEnum(Status) status?: Status;
  @IsOptional() @IsString() @MaxLength(160) search?: string;
  @IsOptional() @IsIn(['dueDate', 'createdAt']) sort?: 'dueDate' | 'createdAt';
  @IsOptional() @IsIn(['asc', 'desc']) direction?: 'asc' | 'desc';
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number;
  @IsOptional() @IsUUID() cursor?: string;
}
