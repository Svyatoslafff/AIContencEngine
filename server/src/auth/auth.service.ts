import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, HydratedDocument, Model, Schema, Types } from 'mongoose';
import { User, UserDocument } from 'src/db/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Session, SessionDocument } from 'src/db/session.schema';
import { log } from 'console';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
        private configService: ConfigService
    ) {}

    async findUser(email: string) {
        return await this.userModel.findOne({ email }).exec();
    }
    async findSession({
        userId,
    }: {
        accessToken?: string;
        userId?: Schema.Types.ObjectId;
    }) {
        log(userId);
        const data = await this.sessionModel.findOne({ userId }).exec();
        log(data);
        return data;
    }

    async loginUser(email: string, password: string) {
        try {
            const user = await this.findUser(email);
            console.log(user);

            if (!user)
                throw new HttpException(
                    'User not found!',
                    HttpStatus.NOT_FOUND
                );

            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordValid)
                throw new HttpException(
                    'Password is not correct',
                    HttpStatus.BAD_REQUEST
                );

            const jwtSecret = this.configService.get<string>('JWT_SECRET');
            const accessToken = jwt.sign({ userId: user._id }, jwtSecret, {
                expiresIn: '1h',
            });

            const prevSession = await this.findSession({
                userId: user._id as Schema.Types.ObjectId,
            });

            console.log(prevSession);

            if (prevSession) {
                const res = await this.sessionModel.deleteOne({
                    userId: user._id,
                });
                log(res);
            }
            const newSession = new this.sessionModel({
                accessToken,
                userId: user._id,
            });
            newSession.save();

            return {
                accessToken,
                email,
                _id: user._id,
            };
        } catch (err) {
            throw err;
        }
    }

    async createUser(email: string, password: string) {
        try {
            const user = await this.findUser(email);
            if (user)
                throw new HttpException(
                    'User with such email already exist',
                    HttpStatus.CONFLICT
                );
            const newUser = new this.userModel({
                email,
                password: await bcrypt.hash(password, 10),
            });
            return newUser.save();
        } catch (err) {
            throw err;
        }
    }
    async refreshUser(payload: string) {
        try {
            const [bearer, token] = payload.split(' ');
            if (bearer !== 'Bearer')
                throw new HttpException(
                    'Authorization token is not bearer',
                    HttpStatus.BAD_REQUEST
                );
            const jwtSecret = this.configService.get<string>('JWT_SECRET');
            log(token);
            const isTokenValid = jwt.verify(token, jwtSecret);
            if (!isTokenValid)
                throw new HttpException(
                    'Token expired',
                    HttpStatus.UNAUTHORIZED
                );
            const session = await this.sessionModel.findOne({
                accessToken: token,
            });
            log(session);
            log(session.userId);
            const user = await this.userModel.findOne({ _id: session.userId });
            if (!session) {
                throw new HttpException(
                    'Session not found',
                    HttpStatus.NOT_FOUND
                );
            }
            const res = await this.sessionModel.deleteOne({
                accessToken: token,
            });
            log(res);
            const newSession = new this.sessionModel({
                accessToken: token,
                userId: session.userId,
            });
            newSession.save();

            return { accessToken: newSession.accessToken, email: user.email };
        } catch (err) {
            throw err;
        }
    }
    async logoutUser(payload: string) {
        try {
            const [bearer, token] = payload.split(' ');
            if (bearer !== 'Bearer')
                throw new HttpException(
                    'Authorization token is not bearer',
                    HttpStatus.BAD_REQUEST
                );
            log(token);

            const data = await this.sessionModel.findOne({
                accessToken: token,
            });

            if (!data)
                throw new HttpException(
                    'Session not found',
                    HttpStatus.NOT_FOUND
                );
            const res = await this.sessionModel.deleteOne({
                accessToken: token,
            });
            log(res);
        } catch (err) {
            throw err;
        }
    }
}
