import { Body, Post, UnauthorizedException } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<{ accessToken: string }> {
    const { email } = await this.usersService.createUser(registerUserDto);
    const accessToken = await this.authService.signPayload({ email });
    return { accessToken };
  }

  @Post('login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    const { email } = loginUserDto;

    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    return this.authService.login(loginUserDto, user);
  }
}
