import {ApiProperty} from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';

enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateTransactionDto {
  @ApiProperty({
    example: 'Salary for June',
    description: 'The title of the transaction',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 5000,
    description: 'The amount of the transaction',
  })
  @IsInt()
  amount: number;

  @ApiProperty({
    example: 'income',
    description: 'The type of the transaction (income or expense)',
    enum: TransactionType,
  })
  @IsEnum(TransactionType)
  type: 'income' | 'expense';

  @ApiProperty({
    example: 1,
    description: 'The category ID of the transaction',
  })
  @IsInt()
  category: number;
}
