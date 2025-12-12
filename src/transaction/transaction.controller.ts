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
import {ApiBearerAuth, ApiBody, ApiResponse} from '@nestjs/swagger';
import {CustomApiUnauthorizedResponse} from 'src/common/decorators/api-responses.decorator';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@CustomApiUnauthorizedResponse()
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiBody({
    type: CreateTransactionDto,
    description: 'Data for creating a new transaction',
    examples: {
      example1: {
        summary: 'Example Transaction',
        value: {
          title: 'Salary for January',
          amount: 100.0,
          type: 'income | expense',
          category: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created.',
    schema: {
      example: {
        id: 1,
        title: 'Salary for January',
        amount: 100.0,
        type: 'income',
        category: {
          id: 1,
          title: 'Salary',
          user: {
            id: 1,
          },
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        user: {
          id: 1,
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
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
