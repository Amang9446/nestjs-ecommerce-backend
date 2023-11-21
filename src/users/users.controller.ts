import {
  Controller,
  Param,
  Get,
  UseGuards,
  Req,
  Patch,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UpdateUserDto } from './dto/update.dto';
import { UpdatePasswordDto } from './dto/password.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getMyUser(@Param() params: { id: string }, @Req() req) {
    return this.usersService.getMyUser(params.id, req);
  }
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.editUser(id, updateUserDto);
  }
  @Patch('change-password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    try {
      const successMessage = await this.usersService.updatePassword(
        id,
        updatePasswordDto,
      );
      return { message: successMessage };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: 'User not found' };
      }
      throw error;
    }
  }
}
