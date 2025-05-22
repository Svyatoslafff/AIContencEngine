import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './middlewares/exceptions.filter';
import { OpenaiRequestsModule } from './openai-requests/openai-requests.module';

@Module({
    imports: [
        AuthModule,
 ConfigModule.forRoot({
 isGlobal: true, // Make the ConfigModule global
 }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_LINK'),
            }),
       }),
       OpenaiRequestsModule,
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule {
    constructor(private configService: ConfigService) {
        const mongo_user = this.configService.get<string>('MONGO_USER');
        const mongo_password = this.configService.get<string>('MONGO_PASSWORD');
        const mongo_cluster = this.configService.get<string>('MONGO_CLUSTER');
    }
}
