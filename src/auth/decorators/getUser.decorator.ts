import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/user.entity';

export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): User => {
    const { user } = ctx.switchToHttp().getRequest();
    return user;
  },
);
