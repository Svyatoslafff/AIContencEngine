import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SessionDocument, Session } from '../db/session.schema';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(
        @InjectModel(Session.name) private sessionModel: Model<SessionDocument>
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No token provided');
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
            const session = await this.sessionModel
                .findOne({ userId: decoded.userId, accessToken: token })
                .exec();

            if (!session) {
                throw new UnauthorizedException('Session not found');
            }
            // req['userId'] = session.userId;
            next();
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
