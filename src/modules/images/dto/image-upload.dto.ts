import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';

export class ImageUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;

  @ApiProperty({ type: 'string' })
  directory: string;
}
