import { Module } from '@nestjs/common';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { SkillRepository } from '../repositories';
import { SupabaseConfig } from '../config/supabase.config';

@Module({
  controllers: [SkillsController],
  providers: [SkillsService, SkillRepository, SupabaseConfig],
})
export class SkillsModule {}

