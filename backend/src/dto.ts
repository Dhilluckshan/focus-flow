import { Transform } from 'class-transformer';
import { IsString, Length, IsEnum, IsISO8601, ValidateIf } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Status } from '@prisma/client';
export class CreateTaskDto {
 @ValidateIf((_,v)=>v!==undefined) @IsString() @Length(1,80) project?: string;
 @ValidateIf((_,v)=>v!==undefined) @IsEnum({LOW:'LOW',MEDIUM:'MEDIUM',HIGH:'HIGH'}) priority?: 'LOW'|'MEDIUM'|'HIGH';
 @Transform(({value}) => typeof value === 'string' ? value.trim() : value)
 @IsString() @Length(1,160) title!: string;
 @ValidateIf((_,v)=>v!==undefined && v!==null) @IsString() @Length(0,5000) description?: string | null;
 @ValidateIf((_,v)=>v!==undefined) @IsEnum(Status) status?: Status;
 @ValidateIf((_,v)=>v!==undefined && v!==null) @IsISO8601({strict:true}) dueDate?: string | null;
}
export class UpdateTaskDto extends PartialType(CreateTaskDto, {skipNullProperties:false}) {}
