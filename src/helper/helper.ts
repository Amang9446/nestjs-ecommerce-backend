// password.helper.ts
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtSecret } from 'src/utils/constants';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function comparePassword(args: {
  password: string;
  hash: string;
}) {
  return await bcrypt.compare(args.password, args.hash);
}

export function signToken(args: { id: string; email: string }): string {
  const payload = args;
  const jwtService = new JwtService();
  return jwtService.sign(payload, { secret: jwtSecret });
}
