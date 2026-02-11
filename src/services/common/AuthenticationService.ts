import { Inject, Service } from "typedi";
import { Database } from "../../api/loaders/db";
import { and, eq } from 'drizzle-orm';
import { NewUser, User, users } from '../../schema/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from "../../config";
import { EmailService } from "./emailService";

@Service()
export class AuthenticationService {
    constructor(
        @Inject('writeDb') private writeDb: Database,
        @Inject('readDb') private readDb: Database,
        @Inject() private emailService: EmailService,
    ) { }


    async verifyToken(token: string): Promise<User> {
        try {
            const decoded = jwt.verify(token, config.auth.secret) as { userId: number };

            const user = await this.readDb.query.users.findFirst({
                where: eq(users.id, decoded.userId),
            });

            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
    


}
