import { Module } from '@nestjs/common';
import { ConfigSystemService } from './config.service';
import { ConfigSystemController } from './config.controller';

@Module({ providers: [ConfigSystemService], controllers: [ConfigSystemController], exports: [ConfigSystemService] })
export class ConfigSystemModule {}
