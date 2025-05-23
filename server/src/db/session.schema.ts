import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaType } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ collection: 'sessions', timestamps: true, versionKey: false })
export class Session {
    @Prop({ type: SchemaType.Types.ObjectId, required: true, ref: 'users' })
    userId: SchemaType.Types.ObjectId;

    @Prop({ required: true })
    accessToken: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
