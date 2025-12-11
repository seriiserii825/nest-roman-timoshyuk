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

  findAll() {
    return this.categoryRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
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
