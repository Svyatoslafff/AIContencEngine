import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { OpenaiRequestsController } from './openai-requests.controller';
import { OpenaiService } from './openai.service';
import { OpenaiRequestSchema, OpenaiRequest } from '../db/openai-request.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: OpenaiRequest.name, schema: OpenaiRequestSchema }]),
  ],
  controllers: [OpenaiRequestsController],
  providers: [OpenaiService],
  exports: [OpenaiService, MongooseModule],
})
export class OpenaiRequestsModule {}