import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(
    loginUserDto: LoginUserDto,
    user: User,
  ): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;

    if (await bcrypt.compare(password, user.password)) {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.signAsync(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid login credentials');
    }
  }
}
