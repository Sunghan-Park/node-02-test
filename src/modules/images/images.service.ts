import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { S3Service } from 'src/modules/s3/s3.service';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly s3Service: S3Service,
  ) {}

  async uploadImage(files: Express.Multer.File[]) {
    const imageUrls = await Promise.all(
      files.map((file) => this.s3Service.uploadFile(file, 'posts')),
    );

    const images = imageUrls.map((url) => this.imageRepository.create({ url }));
    return this.imageRepository.save(images);
  }
}
