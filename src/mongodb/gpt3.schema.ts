import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GPT3ResponseDocument = GPT3Response & Document;

@Schema()
export class GPT3Response {
  @Prop()
  prompt: string;

  @Prop()
  response: string;
}

export const GPT3ResponseSchema = SchemaFactory.createForClass(GPT3Response);
