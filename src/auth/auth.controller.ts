import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

import { CreateUserDto , LoginUserDto } from './dto';
import { GetUser , RawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }


  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRout(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() RawHeaders : string[]
     // @Req() request: Express.Request
  ){
    return {
      user,
      userEmail,
      RawHeaders
    };
  }

  @Get('private2')
  //@SetMetadata('roles',['admin','super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ){
    return 'test2'
  }

  @Get('private3')
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute3(
    @GetUser() user: User
  ){
    return {
      ok : true, 
      user
    }
  }
}
 