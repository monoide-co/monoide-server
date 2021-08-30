import { Body, Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<void> {
    return this.usersService.createUser(registerUserDto);
  }
}
