import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { FriendRequest } from './FriendRequest';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  age: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.requester)
  sentRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.recipient)
  receivedRequests: FriendRequest[];

  @Column('simple-array', { nullable: true })
  friends: any[];
}
