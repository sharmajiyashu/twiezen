import { Service } from "typedi";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

@Service() // 👈 THIS IS REQUIRED
export class S3Service {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_DEFAULT_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
      },
    });
    this.bucket = process.env.AWS_S3_BUCKET_NAME!;
  }

  // async uploadImageWithThumbnail(key: string, buffer: Buffer) {
  //     await this.client.send(new PutObjectCommand({
  //         Bucket: this.bucket,
  //         Key: key,
  //         Body: buffer,
  //         ContentType: "image/jpeg",
  //     }));

  //     let thumbnailKey = key.replace(/([^/]+)$/, "thumbnails/$1");
  //     const thumb = await sharp(buffer).resize(800).jpeg().toBuffer();

  //     await this.client.send(new PutObjectCommand({
  //         Bucket: this.bucket,
  //         Key: thumbnailKey,
  //         Body: thumb,
  //         ContentType: "image/jpeg",
  //     }));

  //     return {
  //         url: key,
  //         thumbnail: thumbnailKey
  //     };
  // }

  async uploadImageWithThumbnail(file: Express.Multer.File, folder: string) {
    if (!file || !file.buffer) {
      throw new Error('No file buffer received');
    }

    const ext = file.mimetype.split('/')[1];
    if (!['jpeg', 'png', 'jpg', 'webp'].includes(ext)) {
      throw new Error('Unsupported image format: ' + file.mimetype);
    }

    // Original
    const originalKey = `${folder}/${Date.now()}.${ext}`;

    await this.client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: originalKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    // Thumbnail (like Laravel resize 800px)
    const thumbBuffer = await sharp(file.buffer)
      .rotate()
      .resize(800, null, { fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const thumbKey = `${folder}/thumbnails/${Date.now()}.jpg`;

    await this.client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: thumbKey,
      Body: thumbBuffer,
      ContentType: 'image/jpeg',
    }));

    return { originalKey, thumbKey };
  }



  async deleteFile(key: string) {
    await this.client.send(new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    }));
  }
}
