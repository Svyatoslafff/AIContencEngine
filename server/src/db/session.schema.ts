import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaType } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ collection: 'sessions', timestamps: true, versionKey: false })
export class Session {
    @Prop({ required: true })
    userId: SchemaType.Types.ObjectId;

    @Prop({ required: true, unique: true })
    accessToken: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    },
});
