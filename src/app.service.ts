import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { map, retryWhen, mergeMap, delay } from 'rxjs/operators';
import { of, throwError, Observable } from 'rxjs';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GPT3Response, GPT3ResponseDocument } from './mongodb/gpt3.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(GPT3Response.name)
    private gpt3ResponseModel: Model<GPT3ResponseDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async saveResponseToDb(prompt: string, response: string) {
    console.log('Saving Prompt: ', prompt);
    console.log('Saving Response: ', response.trim());
    const createdResponse = new this.gpt3ResponseModel({ prompt, response });
    return await createdResponse.save();
  }

  fetchGPT3Response(prompt: string): Observable<any> {
    const url =
      'https://api.openai.com/v1/engines/text-davinci-003/completions';

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.configService.get('OPENAI_API_KEY')}`,
    };

    const data = {
      prompt: prompt,
      max_tokens: 1000,
      temperature: 0.1,
    };

    return this.httpService.post(url, data, { headers }).pipe(
      map((response) => {
        this.saveResponseToDb(prompt, response.data.choices[0].text.trim());
        return response.data.choices[0].text.trim();
      }),
      retryWhen((errors) =>
        errors.pipe(
          // log error message
          mergeMap((error, index) => {
            if (error.response?.status === 429 && index < 5) {
              // retry max 5 times with a delay
              // delay increases by error count
              console.log(error);
              return of(error).pipe(delay(index * 1000));
            }
            // if maximum retries reached or not a 429 error, rethrow
            return throwError(error);
          }),
        ),
      ),
    );
  }
}
