import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@teslo.com',
    description: 'Unique user email address.',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password1',
    minLength: 6,
    maxLength: 50,
    description:
      'Must contain uppercase and lowercase letters and at least one number or symbol.',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({ example: 'Teslo User', minLength: 1 })
  @IsString()
  @MinLength(1)
  fullName: string;
}
