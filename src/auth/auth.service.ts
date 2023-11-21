import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'prisma/prisma.service';
import { comparePassword, hashPassword, signToken } from 'src/helper/helper';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signUp(dto: AuthDto) {
    const { email, password } = dto;
    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    if (foundUser) {
      throw new BadRequestException('email already exists');
    }
    const hashedPassword = await hashPassword(password);

    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return { message: 'SignUp Successfull' };
  }

  async signIn(dto: AuthDto, req: Request, res: Response) {
    const { email, password } = dto;
    const validateEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!validateEmail) {
      throw new BadRequestException('Email or password not matched');
    }
    const validatePassword = await comparePassword({
      password,
      hash: validateEmail.password,
    });
    if (!validatePassword) {
      throw new BadRequestException('Email or password not matched');
    }
    const token = await signToken({
      id: validateEmail.id,
      email: validateEmail.email,
    });
    if (!token) {
      throw new ForbiddenException();
    }
    res.cookie('token', token);
    return res.send({ message: 'Logged in successfully' });
  }

  async signOut(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logged Out Successfully' });
  }
}
