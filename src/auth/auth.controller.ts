import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser, RawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { Auth } from './decorators/auth.decorator';
import { ValidRoles } from './interfaces';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({
    summary: 'Register a user',
    description: 'Creates a user and returns the user data with a JWT token.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'The email is already registered or the request data is invalid.',
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiOperation({ summary: 'Log in' })
  @ApiResponse({
    status: 201,
    description: 'Valid credentials; returns a JWT token.',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get the authenticated user information' })
  @ApiResponse({
    status: 200,
    description: 'Authenticated user information and request headers.',
  })
  @ApiResponse({
    status: 401,
    description: 'A valid token was not provided.',
  })
  testingPrivateRout(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() RawHeaders: string[],
    // @Req() request: Express.Request
  ) {
    return {
      user,
      userEmail,
      RawHeaders,
    };
  }

  @Get('private2')
  //@SetMetadata('roles',['admin','super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Validate role-protected access' })
  @ApiResponse({ status: 200, description: 'Access granted.' })
  @ApiResponse({
    status: 401,
    description: 'A valid token was not provided.',
  })
  @ApiResponse({
    status: 403,
    description: 'The user does not have the required role.',
  })
  privateRoute2(@GetUser() user: User) {
    return 'test2';
  }

  @Get('private3')
  @Auth(ValidRoles.superUser)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Validate super-user access' })
  @ApiResponse({
    status: 200,
    description: 'Access granted for super-users.',
  })
  @ApiResponse({
    status: 403,
    description: 'The user does not have the super-user role.',
  })
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('check-status')
  @Auth()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({
    status: 200,
    description: 'Returns the authenticated user and a refreshed token.',
  })
  @ApiResponse({
    status: 401,
    description: 'A valid token was not provided.',
  })
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
