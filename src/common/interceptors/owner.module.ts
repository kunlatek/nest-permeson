import { Module } from '@nestjs/common';
import { OwnerInterceptor } from './owner.interceptor';

@Module({
  providers: [OwnerInterceptor],
  exports: [OwnerInterceptor],
})
export class OwnerModule {} 