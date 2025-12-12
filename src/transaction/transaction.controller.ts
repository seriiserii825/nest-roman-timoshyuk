import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { IJwtRequest } from 'src/auth/interfaces/IJwtRequest';
import { PaginationTransactionDto } from './dto/pagination-transaction-dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: IJwtRequest,
  ) {
    return this.transactionService.create(
      createTransactionDto,
      req.user.userId,
    );
  }

  @Get()
  findAll(@Req() req: IJwtRequest) {
    return this.transactionService.findAll(req.user.userId);
  }

  @Get('pagination')
  findAllWithPagination(
    @Req() req: IJwtRequest,
    @Query() paginationDto: PaginationTransactionDto,
  ) {
    return this.transactionService.findAllWithPagination(
      req.user.userId,
      paginationDto,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: IJwtRequest) {
    return this.transactionService.findOne(+id, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: IJwtRequest) {
    return this.transactionService.remove(+id, req.user.userId);
  }
}
