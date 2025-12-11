import {ApiProperty} from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'test@mail.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'The password of the user (minimum 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
