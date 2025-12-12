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
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CustomApiUnauthorizedResponse } from 'src/common/decorators/api-responses.decorator';

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

  @Get()
  findAll(@Req() request: IJwtRequest) {
    return this.categoryService.findAll(request.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
