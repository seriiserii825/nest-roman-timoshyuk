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
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CustomApiBadRequestResponse,
  CustomApiUnauthorizedResponse,
} from 'src/common/decorators/api-responses.decorator';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
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

  @ApiResponse({
    status: 200,
    description: 'List of transactions for the authenticated user.',
    schema: {
      example: [
        {
          id: 13,
          title: 'Banking',
          type: 'expense',
          amount: 9999,
          user: {
            id: 9,
            email: 'seriiburduja@gmail.com',
            password:
              '$argon2id$v=19$m=65536,t=3,p=4$7ZJGB4GkiVzCI+CTiAm6AQ$SoNe7v9eVyAVXXewnsPw7eHSVZ3NLiO+XAJXCkHbmpE',
            createdAt: '2025-12-15T21:06:54.710Z',
            updatedAt: '2025-12-15T21:06:54.710Z',
          },
          category: {
            id: 13,
            title: 'my new title',
            createdAt: '2025-12-18T19:13:50.365Z',
            updatedAt: '2025-12-18T19:13:50.365Z',
          },
          createdAt: '2025-12-18T21:11:26.800Z',
          updatedAt: '2025-12-18T21:11:26.800Z',
        },
      ],
    },
  })
  @CustomApiBadRequestResponse('Invalid user ID')
  @Get()
  findAll(@Req() req: IJwtRequest) {
    return this.transactionService.findAll(req.user.userId);
  }

  @ApiResponse({
    status: 200,
    description: 'List of transactions for all users.',
    schema: {
      example: [
        {
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
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @Get('admin')
  findAllAdmin() {
    return this.transactionService.findAllAdmin();
  }

  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Number of transactions to skip for pagination',
    example: 0,
    minimum: 0,
    default: 0,
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of transactions to take for pagination',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of transactions for the authenticated user.',
    schema: {
      example: {
        data: [
          {
            id: 3,
            title: 'Salary for January',
            type: 'income',
            amount: 100,
            category: {
              id: 1,
              title: 'First category',
              createdAt: '2025-12-11T19:12:14.037Z',
              updatedAt: '2025-12-11T19:12:14.037Z',
            },
            createdAt: '2025-12-12T17:13:53.574Z',
            updatedAt: '2025-12-12T17:13:53.574Z',
          },
          {
            id: 2,
            title: 'New transaction',
            type: 'income',
            amount: 400,
            category: {
              id: 2,
              title: 'Second category',
              createdAt: '2025-12-11T19:12:20.321Z',
              updatedAt: '2025-12-11T19:12:20.321Z',
            },
            createdAt: '2025-12-11T19:12:36.725Z',
            updatedAt: '2025-12-11T19:12:36.725Z',
          },
        ],
        count: 2,
      },
    },
  })
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

  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The ID of the transaction to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The transaction details.',
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
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: IJwtRequest) {
    return this.transactionService.findOne(+id, req.user.userId);
  }

  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The ID of the transaction to delete',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The transaction has been successfully deleted.',
    schema: {
      example: {
        message: 'Transaction deleted successfully',
      },
    },
  })
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: IJwtRequest) {
    return this.transactionService.remove(+id, req.user.userId);
  }
}
