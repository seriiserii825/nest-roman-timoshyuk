import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { IValidateUser } from './interfaces/IValidateUser';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async validateUser(user_validated: IValidateUser): Promise<any> {
    const { email, password } = user_validated;
    const user = await this.usersService.findOne(email);
    if (!user) {
      return null;
    }
    const passwordMatch = await argon2.verify(user.password, password);

    if (user && passwordMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
