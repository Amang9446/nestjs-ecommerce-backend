import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateUserDto } from './dto/update.dto';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/password.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMyUser(id: string, req: Request) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException();
    }
    const decodedUser = req.user as { id: string; email: string };
    if (user.id !== decodedUser.id) {
      throw new ForbiddenException();
    }
    delete user.password;
    return { user };
  }

  async getUsers() {
    return await this.prisma.user.findMany({
      select: { id: true, email: true },
    });
  }

  async editUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException();
    }
    if (updateUserDto.email && user.email !== updateUserDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email is already in use');
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return { message: 'Updated Successfully' };
  }
  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException();
    }
    const isOldPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldpassword,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new BadRequestException('Old password is incorrect');
    }
    const hashedNewPassword = await bcrypt.hash(
      updatePasswordDto.newpassword,
      10,
    );

    await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedNewPassword,
      },
    });

    return 'Password Updated Successfully';
  }
}
