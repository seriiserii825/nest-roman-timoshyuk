import {ApiProperty} from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Electronics',
    description: 'The title of the category',
  })
  @IsString()
  title: string;
}
