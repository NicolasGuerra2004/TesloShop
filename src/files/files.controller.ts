import { Controller, Get, Param, Post, UploadedFile, UseInterceptors, ParseFilePipe, FileTypeValidator, StreamableFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { createReadStream } from 'fs';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService, 
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Param('imageName') imageName: string
  ): StreamableFile {
    const path = this.filesService.getStaticProductImage(imageName);
    const file = createReadStream(path);
    const extension = imageName.split('.').pop();

    return new StreamableFile(file, {
      type: `image/${extension}`
    });
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/products',
        filename: (req, file, callback) => {
          const fileExtension = extname(file.originalname);
          const fileName = `${randomUUID()}${fileExtension}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ 
            fileType: '.(png|jpeg|jpg|gif)',
            skipMagicNumbersValidation: true,
          }),
        ],
        errorHttpStatusCode: 400,
      }),
    )
    file: Express.Multer.File,
  ) {
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return {
      secureUrl
    };
  }
}