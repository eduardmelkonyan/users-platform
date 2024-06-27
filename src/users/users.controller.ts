import { Body, Controller, Get, Param, Post, Patch, NotFoundException, BadRequestException, InternalServerErrorException, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { SendFriendRequestDto } from '../dto/SendRequest.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }


  @UseGuards(JwtAuthGuard)
  @Get('requests')
  async viewRequests(@GetUser() user) {
    try {
        const userId = user.id
      const requests = await this.usersService.viewRequests(userId);
      if (!requests) {
        throw new NotFoundException(`Requests for user with id ${userId} not found`);
      }
      return requests;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('requests/:requestId/accept')
  async acceptRequest( @Param('requestId') requestId: number,  @GetUser() user) {
    try {
      const userId = user.id
      const request = await this.usersService.acceptRequest(userId, requestId);
      if (!request) {
        throw new NotFoundException(`Friend request with id ${requestId} not found for user with id ${userId}`);
      }
      return request;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch('/requests/:requestId/decline')
  async declineRequest( @Param('requestId') requestId: number, @GetUser() user) {
    try {
        const userId = user.id
        const request = await this.usersService.declineRequest(userId, requestId);
      if (!request) {
        throw new NotFoundException(`Friend request with id ${requestId} not found for user with id ${userId}`);
      }
      return request;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/requests')
  async sendRequest(@Body() sendFriendRequestDto: SendFriendRequestDto,@GetUser() user) {
    try {
        const userId = user.id
      const request = await this.usersService.sendRequest(userId, sendFriendRequestDto);
      if (!request) {
        throw new BadRequestException('Something went wrong');
      }
      return request;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }


  @UseGuards(JwtAuthGuard)
  @Get('search')
  async advancedSearch(
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('age') age?: number,
  ) {
    try {
      const users = await this.usersService.advancedSearch(firstName, lastName, age);
      if (!users || users.length === 0) {
        throw new NotFoundException('No users found');
      }
      return users;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
