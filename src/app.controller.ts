import { Controller, Get, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { I18nLang } from "nestjs-i18n";
import { Response } from "express";

@ApiTags("root")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Get Hello message" })
  @ApiResponse({
    status: 200,
    description: "Returns a Hello World string",
  })
  getHello(@I18nLang() lang: string): string {
    return this.appService.getHello(lang);
  }

  @Get('mockServiceWorker.js')
  @ApiOperation({ summary: "Mock Service Worker file" })
  @ApiResponse({
    status: 200,
    description: "Returns empty mock service worker file",
  })
  getMockServiceWorker(@Res() res: Response) {
    res.setHeader('Content-Type', 'application/javascript');
    res.send('// Mock Service Worker - Empty file');
  }
}
