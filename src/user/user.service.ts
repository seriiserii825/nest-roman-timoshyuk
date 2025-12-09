import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existing_user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existing_user) {
      throw new BadRequestException('Bad credentials');
    }
    const new_user = this.userRepository.create({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
    });
    try {
      await this.userRepository.save(new_user);
    } catch (error) {
      throw new BadRequestException(`Bad credentials: ${error.message}`);
    }
  }

  findAll() {
    return this.userRepository.find({
      select: ['id', 'email', 'createdAt', 'updatedAt'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
