// middlewares/jwt.middleware.ts
import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No token provided');
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Assuming decoded token contains info to find session, e.g., sessionId
            // You need to implement the logic to find the session based on decoded info
            // For example:
            // const session = await this.sessionService.findSessionById(decoded.sessionId);
            // if (!session) {
            //     throw new UnauthorizedException('Session not found');
            // }
            // req['userId'] = session.userId; // Attach userId to request
            // If you still need the decoded token for other purposes: req['user'] = decoded;
            next();
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
