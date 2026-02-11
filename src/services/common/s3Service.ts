import { Service, Inject } from 'typedi';
import { S3Client, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import config from '../../config';
import AppLogger from '../../api/loaders/logger';
import { MediaType } from '../../constants/enum';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import fs from 'fs';
import { spawn } from 'child_process';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { Upload } from '@aws-sdk/lib-storage';

export interface IMediaResult {
  type: MediaType;
  key: string;
  mimetype: string;
  url: string;
  size?: number;
  width?: number;
  height?: number;
}

@Service()
export class S3Service {
  constructor(@Inject('s3Client') private readonly s3Client: S3Client) {}

  async uploadMedia(
    type: MediaType,
    files: Express.Multer.File[],
    path: string
  ): Promise<IMediaResult[]> {
    try {
      if (type === MediaType.video) {
        return await this.uploadVideo(path, files);
      } else if (type === MediaType.gif) {
        return await this.uploadGif(path, files);
      } else if (type === MediaType.document) {
        return await this.uploadDocument(path, files);
      } else {
        return await this.uploadImages(path, files);
      }
    } catch (error) {
      await this.cleanupFailedUploads(path);
      throw error;
    }
  }

  private async uploadVideo(
    folderPath: string,
    files: Express.Multer.File[]
  ): Promise<IMediaResult[]> {
    const results: IMediaResult[] = [];

    for (const file of files) {
      const optimizedBuffer = await this.optimizeVideo(file.buffer);
      const videoKey = `${folderPath}/${randomUUID()}.${file.mimetype.split('/')[1]}`;

      await this.uploadFile(videoKey, optimizedBuffer, file.mimetype);
      const signedUrl = await this.getSignedUrl(videoKey);

      results.push({
        type: MediaType.video,
        key: videoKey,
        mimetype: 'video/mp4',
        url: signedUrl,
        size: optimizedBuffer.length
      });
    }

    return results;
  }

  private async uploadImages(
    folderPath: string,
    files: Express.Multer.File[]
  ): Promise<IMediaResult[]> {
    const results: IMediaResult[] = [];

    for (const file of files) {
      const optimizedBuffer = await this.optimizeImage(file.buffer);
      const imageKey = `${folderPath}/${randomUUID()}.${file.mimetype.split('/')[1]}`;

      await this.uploadFile(imageKey, optimizedBuffer, file.mimetype);
      const signedUrl = await this.getSignedUrl(imageKey);

      results.push({
        type: MediaType.image,
        key: imageKey,
        mimetype: file.mimetype,
        url: signedUrl,
        size: file.size
      });
    }

    return results;
  }

  private async uploadGif(
    folderPath: string,
    files: Express.Multer.File[]
  ): Promise<IMediaResult[]> {
    const results: IMediaResult[] = [];

    for (const file of files) {
      const gifKey = `${folderPath}/${randomUUID()}.${file.mimetype.split('/')[1]}`;
      await this.uploadFile(gifKey, file.buffer, file.mimetype);
      const signedUrl = await this.getSignedUrl(gifKey);

      results.push({
        type: MediaType.gif,
        key: gifKey,
        mimetype: file.mimetype,
        url: signedUrl,
        size: file.size
      });
    }

    return results;
  }

  private async uploadDocument(
    folderPath: string,
    files: Express.Multer.File[]
  ): Promise<IMediaResult[]> {
    const results: IMediaResult[] = [];

    for (const file of files) {
      if (file.mimetype !== 'application/pdf') {
        throw new Error(
          `Invalid file type. Only PDF files are allowed. Received: ${file.mimetype}`
        );
      }

      const documentKey = `${folderPath}/${randomUUID()}.pdf`;
      await this.uploadFile(documentKey, file.buffer, file.mimetype);
      const signedUrl = await this.getSignedUrl(documentKey);

      results.push({
        type: MediaType.document,
        key: documentKey,
        mimetype: file.mimetype,
        url: signedUrl,
        size: file.size
      });
    }

    return results;
  }

  private async uploadFile(key: string, buffer: Buffer, contentType: string): Promise<void> {
    const params = {
      Bucket: config.aws.s3.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: 'public, max-age=2592000', // 30 days cache (30 * 24 * 60 * 60)
      Metadata: {
        uploadedAt: new Date().toISOString()
      }
    };

    await this.s3Client.send(new PutObjectCommand(params));
  }

  // async getSignedUrl(key: string, expiresIn: number = 86400): Promise<string> {
  async getSignedUrl(key: string): Promise<string> {
    try {
      const cloudfrontUrl = `https://${config.aws.s3.cdnUrl}/${key}`;
      // return getSignedUrl({
      //   url: cloudfrontUrl,
      //   keyPairId: config.aws.s3.accessKeyId,
      //   privateKey: config.aws.s3.secretAccessKey,
      //   dateLessThan: new Date(Date.now() + expiresIn * 1000)
      // });
      return cloudfrontUrl;
    } catch (error) {
      AppLogger.error('Failed to generate signed URL:', error);
      return `https://${config.aws.s3.cdnUrl}/${key}`;
    }
  }

  async refreshSignedUrl(key: string): Promise<string> {
    return this.getSignedUrl(key); // 24 hours
  }

  async deleteMedia(keys: string[]): Promise<void> {
    const s3Keys = keys.map(key => key.replace(/^https:\/\/dioz2wg93hfbq\.cloudfront\.net\//, ''));
    if (s3Keys.length === 0) return;
    await this.s3Client.send(
      new DeleteObjectsCommand({
        Bucket: config.aws.s3.bucketName,
        Delete: {
          Objects: s3Keys.map(key => ({ Key: key }))
        }
      })
    );
  }

  private async cleanupFailedUploads(folderPath: string): Promise<void> {
    // TODO: Implement cleanup logic for failed uploads
    AppLogger.info(`Cleaning up failed uploads in: ${folderPath}`);
  }

  private async optimizeImage(buffer: Buffer, quality: number = 80): Promise<Buffer> {
    return sharp(buffer)
      .jpeg({ quality, progressive: true })
      .png({ quality, progressive: true })
      .webp({ quality })
      .toBuffer();
  }

  private async optimizeVideo(buffer: Buffer): Promise<Buffer> {
    const inputPath = `/tmp/${randomUUID()}.mp4`;
    const outputPath = `/tmp/${randomUUID()}_optimized.mp4`;

    fs.writeFileSync(inputPath, buffer);

    return new Promise((resolve, reject) => {
      const ffmpeg = spawn(ffmpegInstaller.path, [
        '-i',
        inputPath,
        '-c:v',
        'libx264',
        '-c:a',
        'aac',
        '-b:v',
        '1000k',
        '-b:a',
        '128k',
        '-r',
        '30',
        '-preset',
        'fast',
        '-crf',
        '23',
        '-movflags',
        '+faststart',
        outputPath
      ]);

      ffmpeg.on('close', code => {
        if (code === 0) {
          const optimizedBuffer = fs.readFileSync(outputPath);
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
          resolve(optimizedBuffer);
        } else {
          reject(new Error(`FFmpeg failed with code ${code}`));
        }
      });

      ffmpeg.on('error', reject);
    });
  }

  async uploadVideoFromUrlStreaming(
    sourceUrl: string,
    destinationKey: string,
    metadata?: { livestreamId?: string; duration?: number; size?: number }
  ): Promise<{ url: string; key: string; size: number }> {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const contentLength = response.headers.get('content-length');
    const fileSize = contentLength ? parseInt(contentLength, 10) : 0;

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const key = `livestreams/${destinationKey}`;

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: config.aws.s3.bucketName,
        Key: key,
        Body: buffer,
        ContentType: 'video/mp4',
        CacheControl: 'public, max-age=2592000',
        Metadata: {
          uploadedAt: new Date().toISOString(),
          ...(metadata?.livestreamId && { livestreamId: metadata.livestreamId }),
          ...(metadata?.duration && { duration: metadata.duration.toString() })
        }
      },
      partSize: 10 * 1024 * 1024,
      leavePartsOnError: false
    });

    upload.on('httpUploadProgress', progress => {
      if (progress.total) {
        const percent = Math.round((progress.loaded! / progress.total) * 100);
        AppLogger.info(`S3 upload progress: ${percent}%`);
      }
    });

    await upload.done();
    const url = await this.getSignedUrl(key);

    return {
      url,
      key,
      size: buffer.length || fileSize
    };
  }

  async uploadThumbnailFromUrl(sourceUrl: string, destinationKey: string): Promise<string> {
    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new Error(`Failed to download thumbnail: ${response.statusText}`);
    }

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    const optimizedBuffer = await this.optimizeImage(buffer, 85);

    const key = `livestreams/thumbnails/${destinationKey}`;

    await this.uploadFile(key, optimizedBuffer, 'image/jpeg');

    const url = await this.getSignedUrl(key);

    return url;
  }
}
