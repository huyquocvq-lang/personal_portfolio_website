import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { SkillsModule } from './skills/skills.module';

@Module({
  imports: [BlogModule, SkillsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
