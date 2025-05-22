import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/db/user.schema';
import { Session, SessionSchema } from 'src/db/session.schema';
import { JwtMiddleware } from 'src/middlewares/validateToken.middleware';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Session.name, schema: SessionSchema },
        ]),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
