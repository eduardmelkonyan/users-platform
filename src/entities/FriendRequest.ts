import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity({ name: 'friend_requests' })
export class FriendRequest {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  requesterId: number;

  @Column()
  recipientId: number;

  @Column()
  status: string;

  @ManyToOne(() => User, user => user.sentRequests)
  requester: User;

  @ManyToOne(() => User, user => user.receivedRequests)
  recipient: User;
}