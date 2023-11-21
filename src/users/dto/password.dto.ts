import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'password must be between 3 to 20 char' })
  public oldpassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20, { message: 'password must be between 3 to 20 char' })
  public newpassword: string;
}
