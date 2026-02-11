import { Express } from 'express';
import AppLogger from './logger';
import expressLoader from './express';
import dbLoader from './db';
import dependencyInjector from './di';
import smtpLoader from './smtp';
import s3Loader from './s3';

export default async (expressApp: Express): Promise<void> => {
    const { writeDb, readDb } = await dbLoader();
    const emailTransporter = await smtpLoader();
    const s3Client = await s3Loader();
    await dependencyInjector({ writeDb, readDb, emailTransporter, s3Client });
    expressLoader(expressApp);
    AppLogger.info('✌️ Express Loaded Successfully');
};
