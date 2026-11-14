import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Database seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth(ValidRoles.admin)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Load initial data',
    description: 'Resets and loads the test catalog data.',
  })
  @ApiResponse({
    status: 200,
    description: 'Initial data loaded successfully.',
  })
  @ApiResponse({
    status: 401,
    description: 'A valid token was not provided.',
  })
  @ApiResponse({
    status: 403,
    description: 'Only administrators can execute this operation.',
  })
  executeSeed() {
    void this.seedService.runSeed();
  }
}
