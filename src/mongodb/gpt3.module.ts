import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GPT3Response, GPT3ResponseSchema } from './gpt3.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GPT3Response.name, schema: GPT3ResponseSchema },
    ]),
  ],
})
export class UserModule {}
