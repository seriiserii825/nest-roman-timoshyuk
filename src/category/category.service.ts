import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IJwtRequest } from 'src/auth/interfaces/IJwtRequest';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, request: IJwtRequest) {
    const userId = request.user.userId;
    const category_exists = await this.categoryRepository.findOne({
      where: { title: createCategoryDto.title, user: { id: userId } },
    });
    if (category_exists) {
      throw new BadRequestException('Category already exists');
    }
    const new_category = this.categoryRepository.create({
      title: createCategoryDto.title,
      user: { id: userId },
    });
    return this.categoryRepository.save(new_category);
  }

  findAll(user_id: number) {
    return this.categoryRepository.find({
      where: {
        user: { id: user_id },
      },
      relations: {
        transactions: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    // 1. Ищем категорию по id
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // 2. Проверяем, занят ли title другой категорией
    const categoryWithSameTitle = await this.categoryRepository.findOne({
      where: {
        title: updateCategoryDto.title,
        id: Not(id), // 👈 важно
      },
    });

    if (categoryWithSameTitle) {
      throw new BadRequestException('Category title already in use');
    }

    // 3. Обновляем
    category.title = updateCategoryDto.title;

    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['transactions'], // Load related transactions
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.transactions && category.transactions.length > 0) {
      throw new BadRequestException(
        'Cannot delete category with existing transactions',
      );
    }

    return await this.categoryRepository.remove(category);
  }
}
