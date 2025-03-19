import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  jwtRefreshTokenSecretKey: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
  port: process.env.PORT,
}));
