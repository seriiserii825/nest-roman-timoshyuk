import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { IJwtRequest } from 'src/auth/interfaces/IJwtRequest';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CustomApiBadRequestResponse, CustomApiNotFoundResponse, CustomApiUnauthorizedResponse } from 'src/common/decorators/api-responses.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBody({
    type: CreateCategoryDto,
    description: 'Data for creating a new category',
    examples: {
      example1: {
        summary: 'Example Category',
        value: {
          title: 'Electronics',
        },
      },
    },
  })
  @CustomApiBadRequestResponse('Category already exists')
  @ApiResponse({
    status: 201,
    description: 'The category has been successfully created.',
    schema: {
      example: {
        id: 1,
        title: 'Electronics',
        user: {
          id: 1,
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @CustomApiUnauthorizedResponse()
  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() request: IJwtRequest,
  ) {
    return this.categoryService.create(createCategoryDto, request);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @CustomApiUnauthorizedResponse()
  @ApiResponse({
    status: 200,
    description: 'List of categories for the authenticated user.',
    schema: {
      example: [
        {
          id: 1,
          title: 'Electronics',
          user: {
            id: 1,
          },
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @Get()
  findAll(@Req() request: IJwtRequest) {
    return this.categoryService.findAll(request.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @CustomApiUnauthorizedResponse()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The ID of the category to retrieve',
    example: 1,
  })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Data for creating a new category',
    examples: {
      example1: {
        summary: 'Example Category',
        value: {
          title: 'Electronics',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The category with the specified ID.',
    schema: {
      example: {
        id: 1,
        title: 'Electronics',
        user: {
          id: 1,
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @CustomApiUnauthorizedResponse()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The ID of the category to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully updated.',
    schema: {
      example: {
        id: 1,
        title: 'Updated Electronics',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      },
    },
  })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @CustomApiUnauthorizedResponse()
  @ApiParam({
    name: 'id',
    type: 'integer',
    description: 'The ID of the category to retrieve',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully removed.',
    schema: {
      example: {
        message: 'Category removed successfully',
      },
    },
  })
  @CustomApiNotFoundResponse('Category not found')
  @CustomApiBadRequestResponse('Cannot delete category with existing transactions')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
