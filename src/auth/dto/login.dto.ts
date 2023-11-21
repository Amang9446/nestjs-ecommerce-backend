import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';

export class loginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'password must be between 3 to 20 char' })
  public password: string;
}
