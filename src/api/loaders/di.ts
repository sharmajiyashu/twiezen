import AppLogger from './logger';
import Container from 'typedi';
import nodemailer from 'nodemailer';
import { S3Client } from '@aws-sdk/client-s3';
import { Database } from './db';

export default async ({
    writeDb,
    readDb,
    emailTransporter,
    s3Client
}: {
    writeDb: Database;
    readDb: Database;
    emailTransporter: nodemailer.Transporter;
    s3Client: S3Client;
}): Promise<void> => {
    Container.set('writeDb', writeDb);
    Container.set('readDb', readDb);
    Container.set('emailTransporter', emailTransporter);
    Container.set('s3Client', s3Client);
    AppLogger.info('✌️ Dependency Injector Loaded');
};
