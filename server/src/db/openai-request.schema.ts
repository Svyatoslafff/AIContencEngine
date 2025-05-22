import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OpenaiRequestDocument = OpenaiRequest & Document;

@Schema()
export class OpenaiRequest {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true })
  response: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const OpenaiRequestSchema = SchemaFactory.createForClass(OpenaiRequest);