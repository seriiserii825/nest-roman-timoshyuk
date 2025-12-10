import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { IValidateUser } from './interfaces/IValidateUser';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from './interfaces/IJwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

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

  async login(user: any) {
    const payload: IJwtPayload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
