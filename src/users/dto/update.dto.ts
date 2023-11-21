import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'password must be between 3 to 20 char' })
  public password: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public address: string;

  @IsString()
  @IsNotEmpty()
  public phoneNumber: string;
}
