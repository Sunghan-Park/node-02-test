import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsConfigService {
  constructor(private configService: ConfigService) {}

  get accessKeyId(): string {
    const accessKeyId = this.configService.get<string>('aws.accessKeyId');
    if (!accessKeyId) {
      throw new Error('AWS_ACCESS_KEY_ID is not defined in the configuration');
    }
    return accessKeyId;
  }

  get secretAccessKey(): string {
    const secretKey = this.configService.get<string>('aws.secretAccessKey');
    if (!secretKey) {
      throw new Error(
        'AWS_SECRET_ACCESS_KEY is not defined in the configuration',
      );
    }
    return secretKey;
  }

  get s3BucketName(): string {
    const bucketName = this.configService.get<string>('aws.s3BucketName');
    if (!bucketName) {
      throw new Error('AWS_S3_BUCKET_NAME is not defined in the configuration');
    }
    return bucketName;
  }

  get region(): string {
    const region = this.configService.get<string>('aws.region');
    if (!region) {
      throw new Error('AWS_REGION is not defined in the configuration');
    }
    return region;
  }
}
