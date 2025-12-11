import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IJwtRequest } from 'src/auth/interfaces/IJwtRequest';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, request: IJwtRequest) {
    console.log(request, 'request');
    const userId = request.user.userId;
    console.log('userId', userId);
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
        transactions: true
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
    const updated_category = await this.categoryRepository.preload({
      id: id,
      ...updateCategoryDto,
    });
    if (!updated_category) {
      throw new NotFoundException('Category not found');
    }
    return this.categoryRepository.save(updated_category);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryRepository.remove(category);
    return { message: 'Category removed successfully' };
  }
}
