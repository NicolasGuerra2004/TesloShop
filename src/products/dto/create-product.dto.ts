import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Classic Hoodie', minLength: 1 })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({ example: 49.99, minimum: 0 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ example: 'Comfortable cotton hoodie.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'classic_hoodie' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ example: 25, minimum: 1 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({ example: ['S', 'M', 'L'], type: [String] })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({ example: 'unisex', enum: ['men', 'women', 'kid', 'unisex'] })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiPropertyOptional({ example: ['hoodie', 'cotton'], type: [String] })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiPropertyOptional({
    example: ['https://cdn.teslo.com/hoodie.jpg'],
    type: [String],
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
