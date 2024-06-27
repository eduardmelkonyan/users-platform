import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { UsersService } from 'src/users/users.service';
  import * as bcrypt from 'bcryptjs';
  import { CreateUserDto } from 'src/dto/CreateUser.dto';
  
  @Injectable()
  export class AuthService {
    constructor(
      private userService: UsersService,
      private jwtService: JwtService,
    ) {}
    async login(userDto: CreateUserDto) {
      const user = await this.validateUser(userDto);
      return this.generateToken(user);
    }
  
    async registration(userDto: CreateUserDto) {
      const candidate = await this.userService.getUserByEmail(userDto.email);
      if (candidate) {
        throw new HttpException(
          'This email already exist!',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hashPassword = await bcrypt.hash(userDto.password, 5);
      const user = await this.userService.create({
          ...userDto,
          password: hashPassword,
      });
      return user;
    }
    private async generateToken(user) {
      const payload = { email: user.email, id: user.id};
      return { token: this.jwtService.sign(payload) };
    }
    private async validateUser(userDto: CreateUserDto) {
      const user = await this.userService.getUserByEmail(userDto.email);
      const passwordEquals = await bcrypt.compare(
        userDto.password,
        user.password,
      );
      if (user && passwordEquals) {
        return user;
      }
      throw new UnauthorizedException({ message: 'Wrong email or password!' });
    }
  }