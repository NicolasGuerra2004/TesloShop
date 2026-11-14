import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dt';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import {
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreateProductDto })
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  @ApiResponse({
    status: 400,
    description: 'The request data is invalid or a conflict occurred.',
  })
  @ApiResponse({
    status: 401,
    description: 'A valid token was not provided.',
  })
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'List products',
    description: 'Returns a paginated list of products.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Maximum number of results to return.',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    example: 0,
    description: 'Number of results to skip.',
  })
  @ApiResponse({ status: 200, description: 'List of products.' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({
    summary: 'Get a product',
    description: 'Searches by UUID, title, or slug.',
  })
  @ApiParam({
    name: 'term',
    description: 'Product UUID, title, or slug.',
    example: 'classic_hoodie',
  })
  @ApiResponse({ status: 200, description: 'Product found.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateProductDto })
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Product UUID.' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'The request data is invalid.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Product UUID.' })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
