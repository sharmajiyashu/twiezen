import { S3Client } from '@aws-sdk/client-s3';
import config from '../../config';
import AppLogger from './logger';

export default async (): Promise<S3Client> => {
    if (
        !config.aws.s3.accessKeyId ||
        !config.aws.s3.secretAccessKey ||
        !config.aws.region ||
        !config.aws.s3.bucketName
    ) {
        throw new Error(
            'AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_REGION, and AWS_S3_BUCKET_NAME are not set in config'
        );
    }
    const s3Client = new S3Client({
        region: config.aws.region,
        credentials: {
            accessKeyId: config.aws.s3.accessKeyId as string,
            secretAccessKey: config.aws.s3.secretAccessKey as string
        }
    });
    AppLogger.info(`✌️ S3 Client Loaded`);
    return s3Client;
};
