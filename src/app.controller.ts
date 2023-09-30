import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
// import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('fetch-gpt')
  async fetchGPT(@Query('prompt') prompt: string) {
    return await this.appService.fetchGPT3Response(prompt);
  }
}
