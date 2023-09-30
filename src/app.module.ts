import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { GPT3Response, GPT3ResponseSchema } from './mongodb/gpt3.schema';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb+srv://ktjhan:swordfish@cluster0.rx0qtgn.mongodb.net/?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([{ name: 'response', schema: GPT3ResponseModel }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
