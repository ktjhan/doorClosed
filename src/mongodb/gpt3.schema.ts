import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type GPT3ResponseDocument = GPT3Response & Document;

@Schema()
export class GPT3Response {
  @Prop({
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  })
  _id: string;

  @Prop()
  prompt: string;

  @Prop()
  response: string;
}

export const GPT3ResponseSchema = SchemaFactory.createForClass(GPT3Response);
