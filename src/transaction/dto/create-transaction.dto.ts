import { IsEnum, IsInt, IsString } from 'class-validator';

enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreateTransactionDto {
  @IsString()
  title: string;

  @IsInt()
  amount: number;

  @IsEnum(TransactionType)
  type: 'income' | 'expense';

  @IsInt()
  category: number;
}
