import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private userService: UserService,
    private categoryService: CategoryService,
  ) {}
  async create(createTransactionDto: CreateTransactionDto, user_id: number) {
    const user = await this.userService.findById(user_id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    console.log(createTransactionDto.category, 'createTransactionDto.category');
    const category = await this.categoryService.findOne(
      createTransactionDto.category,
    );
    console.log(category, 'category');
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    const new_transaction = this.transactionRepository.create({
      ...createTransactionDto,
      category: { id: createTransactionDto.category },
      user: { id: user_id },
    });
    try {
      return this.transactionRepository.save(new_transaction);
    } catch (error) {
      const message = error.message
        ? error.message
        : 'Error creating transaction';
      throw new BadRequestException(message);
    }
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
