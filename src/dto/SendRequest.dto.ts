import { IsInt } from 'class-validator';

export class SendFriendRequestDto {
  @IsInt()
  recipientId: number;
}