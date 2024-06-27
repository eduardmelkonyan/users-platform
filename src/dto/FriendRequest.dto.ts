import { IsString, IsInt } from 'class-validator';

export class FriendRequestDto {
  @IsInt()
  id: number;

  @IsInt()
  requesterId: number;

  @IsInt()
  recipientId: number;

  @IsString()
  status: string;
}