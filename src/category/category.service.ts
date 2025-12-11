import { BadRequestException, Injectable } from '@nestjs/common';
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
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
