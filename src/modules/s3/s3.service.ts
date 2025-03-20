import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AwsConfigService } from './../../config/aws/config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  private s3: S3Client;
  constructor(private readonly awsConfigService: AwsConfigService) {
    this.s3 = new S3Client({
      region: this.awsConfigService.region,
      credentials: {
        accessKeyId: this.awsConfigService.accessKeyId,
        secretAccessKey: this.awsConfigService.secretAccessKey,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, directory: string) {
    const fileName = Date.now().toString();

    const uploadParams = {
      Bucket: this.awsConfigService.s3BucketName,
      Key: `${directory}/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3.send(new PutObjectCommand(uploadParams));

    return `https://${this.awsConfigService.s3BucketName}.s3.${this.awsConfigService.region}.amazonaws.com/${directory}/${fileName}`;
  }
}
