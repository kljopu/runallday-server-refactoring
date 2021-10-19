import { createParamDecorator } from '@nestjs/common';

export const UserDecorator = createParamDecorator((data: string, req) => {
  return data ? req.user && req.user[data] : req.user;
});
