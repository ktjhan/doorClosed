import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { map, retryWhen, delay, mergeMap } from 'rxjs/operators';
import { of, throwError, Observable } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

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
      map((response) => response.data),
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
