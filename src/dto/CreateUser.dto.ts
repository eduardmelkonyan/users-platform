import { IsString, IsInt, Min, MaxLength, MinLength, IsEmail, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { FriendRequestDto } from './FriendRequest.dto';


export class CreateUserDto {
  @IsString()
  @MaxLength(50)
  first_name: string;

  @IsString()
  @MaxLength(50)
  last_name: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsArray()
  friends?: any[] = [];
}