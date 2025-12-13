import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';
import { PaginationTransactionDto } from './dto/pagination-transaction-dto';

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
    const category = await this.categoryService.findOne(
      createTransactionDto.category,
    );
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    const new_transaction = this.transactionRepository.create({
      ...createTransactionDto,
      category: { id: createTransactionDto.category },
      user: { id: user_id },
    });
    return this.transactionRepository.save(new_transaction);
  }

  //TODO: update swagger docs error
  findAll(user_id: number) {
    if (!user_id) {
      throw new BadRequestException('User ID is required');
    }
    return this.transactionRepository.find({
      where: { user: { id: user_id } },
      relations: ['category', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  
  findAllAdmin() {
    return this.transactionRepository.find({
      relations: ['category', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllWithPagination(user_id: number, dto: PaginationTransactionDto) {
    const transactions = await this.transactionRepository.findAndCount({
      where: { user: { id: user_id } },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      skip: dto.skip,
      take: dto.take,
    });
    const total = transactions[1];
    return {
      data: transactions[0],
      count: total,
    }
  }

  findOne(id: number, user_id: number) {
    return this.transactionRepository.findOne({
      where: { id, user: { id: user_id } },
      relations: ['category'],
    });
  }

  async remove(id: number, user_id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id, user: { id: user_id } },
    });
    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }
    await this.transactionRepository.remove(transaction);
    return {
      message: 'Transaction deleted successfully',
    };
  }
}
