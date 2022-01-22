import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    try {
      const createdUser = await this.usersRepository.save(user);
      return createdUser;
    } catch (err) {
      switch (err.code) {
        case '23505':
          throw new ConflictException('User with given email already exists');
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  getUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }
}
