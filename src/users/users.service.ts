import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from 'src/entities/FriendRequest';
import { CreateUserDto } from 'src/dto/CreateUser.dto';
import { SendFriendRequestDto } from 'src/dto/SendRequest.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(FriendRequest)
    private friendRequestsRepository: Repository<FriendRequest>,
  ) {}

  async getUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    return user;
  }

  findAll() {
    return this.usersRepository.find({
      relations: ['sentRequests', 'receivedRequests'],
    });
  }

  async findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['sentRequests', 'receivedRequests'],
    });
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create({
      ...createUserDto,
      friends: createUserDto.friends ?? [],
    });
    await this.usersRepository.save(user);
    return user;
  }

  async viewRequests(userId: number) {
    const user = await this.findOne(userId);
    if (user) {
      return user.receivedRequests;
    }
    return null;
  }

  async acceptRequest(userId: number, requestId: number) {
    const request = await this.friendRequestsRepository.findOne({
      where: { id: requestId },
      relations: ['recipient'],
    });

    if (request && request.recipient.id === userId) {
      request.status = 'accepted';
      await this.friendRequestsRepository.save(request);

      const user = await this.findOne(userId);
      user.friends = user.friends
        ? [...user.friends, request.requesterId]
        : [request.requesterId];
      await this.usersRepository.save(user);

      const requester = await this.findOne(request.requesterId);
      requester.friends = requester.friends
        ? [...requester.friends, userId]
        : [userId];
      await this.usersRepository.save(requester);

      return request;
    }

    return null;
  }

  async declineRequest(userId: number, requestId: number) {
    const request = await this.friendRequestsRepository.findOne({
      where: { id: requestId },
      relations: ['recipient'],
    });
    if (request && request.recipient.id === userId) {
      request.status = 'declined';
      await this.friendRequestsRepository.save(request);
      return request;
    }
    return null;
  }

  async sendRequest(userId: number, sendFriendRequestDto: SendFriendRequestDto) {
    const { recipientId } = sendFriendRequestDto;
    const requester = await this.findOne(userId);
    const recipient = await this.findOne(recipientId);

    if (!requester || !recipient) {
      return null;
    }

    const friendRequest = this.friendRequestsRepository.create({
      requester,
      recipient,
      status: 'pending',
    });

    await this.friendRequestsRepository.save(friendRequest);

    return friendRequest;
  }

  async advancedSearch(firstName?: string, lastName?: string, age?: number): Promise<User[]> {
    const query = this.usersRepository.createQueryBuilder('user');

    if (firstName) {
      query.andWhere('user.first_name LIKE :firstName', { firstName: `%${firstName}%` });
    }

    if (lastName) {
      query.andWhere('user.last_name LIKE :lastName', { lastName: `%${lastName}%` });
    }

    if (age !== undefined) {
      query.andWhere('user.age = :age', { age });
    }

    return await query.getMany();
  }
}
