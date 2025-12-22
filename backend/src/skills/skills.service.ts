import { Injectable, NotFoundException } from '@nestjs/common';
import { SkillRepository } from '../repositories';
import { Skill } from '../entities';
import { CreateSkillDto, UpdateSkillDto, SkillDto, SkillListResponseDto, SkillDetailDto, RelatedProjectDto } from './dto';
import { Language } from '../blog/dto';

@Injectable()
export class SkillsService {
  constructor(private readonly skillRepository: SkillRepository) {}

  async findAll(lang: Language = Language.VI): Promise<SkillListResponseDto> {
    const skills = await this.skillRepository.findAll();

    const data: SkillDto[] = skills.map((skill) => ({
      id: skill.id,
      title: lang === Language.VI ? skill.title_vi : skill.title_en,
      description: lang === Language.VI ? skill.description_vi : skill.description_en,
      icon_url: skill.icon_url,
      highlighted: skill.highlighted,
      display_order: skill.display_order,
      created_at: skill.created_at,
      updated_at: skill.updated_at,
    }));

    return { data };
  }

  async findOne(id: string, lang: Language = Language.VI): Promise<SkillDto> {
    const skill = await this.skillRepository.findOneById(id);

    if (!skill) {
      throw new NotFoundException(`Skill with id "${id}" not found`);
    }

    return {
      id: skill.id,
      title: lang === Language.VI ? skill.title_vi : skill.title_en,
      description: lang === Language.VI ? skill.description_vi : skill.description_en,
      icon_url: skill.icon_url,
      highlighted: skill.highlighted,
      display_order: skill.display_order,
      created_at: skill.created_at,
      updated_at: skill.updated_at,
    };
  }

  async findBySlug(slug: string, lang: Language = Language.VI): Promise<SkillDetailDto> {
    const skill = await this.skillRepository.findBySlug(slug, lang);

    if (!skill) {
      throw new NotFoundException(`Skill with slug "${slug}" not found`);
    }

    // TODO: Implement related projects fetching when project API is available
    // For now, return empty array
    const relatedProjects: RelatedProjectDto[] = [];

    return {
      id: skill.id,
      title: lang === Language.VI ? skill.title_vi : skill.title_en,
      description: lang === Language.VI ? skill.description_vi : skill.description_en,
      icon_url: skill.icon_url,
      highlighted: skill.highlighted,
      display_order: skill.display_order,
      created_at: skill.created_at,
      updated_at: skill.updated_at,
      related_projects: relatedProjects,
    };
  }

  async create(createSkillDto: CreateSkillDto): Promise<SkillDto> {
    const skill: Partial<Skill> = {
      title_vi: createSkillDto.title_vi,
      title_en: createSkillDto.title_en,
      description_vi: createSkillDto.description_vi,
      description_en: createSkillDto.description_en,
      icon_url: createSkillDto.icon_url,
      highlighted: createSkillDto.highlighted || false,
      display_order: createSkillDto.display_order || 0,
    };

    const created = await this.skillRepository.create(skill);

    return {
      id: created.id,
      title: created.title_vi,
      description: created.description_vi,
      icon_url: created.icon_url,
      highlighted: created.highlighted,
      display_order: created.display_order,
      created_at: created.created_at,
      updated_at: created.updated_at,
    };
  }

  async update(id: string, updateSkillDto: UpdateSkillDto): Promise<SkillDto> {
    const existing = await this.skillRepository.findOneById(id);
    if (!existing) {
      throw new NotFoundException(`Skill with id "${id}" not found`);
    }

    const updateData: Partial<Skill> = {};
    if (updateSkillDto.title_vi !== undefined) updateData.title_vi = updateSkillDto.title_vi;
    if (updateSkillDto.title_en !== undefined) updateData.title_en = updateSkillDto.title_en;
    if (updateSkillDto.description_vi !== undefined)
      updateData.description_vi = updateSkillDto.description_vi;
    if (updateSkillDto.description_en !== undefined)
      updateData.description_en = updateSkillDto.description_en;
    if (updateSkillDto.icon_url !== undefined) updateData.icon_url = updateSkillDto.icon_url;
    if (updateSkillDto.highlighted !== undefined) updateData.highlighted = updateSkillDto.highlighted;
    if (updateSkillDto.display_order !== undefined)
      updateData.display_order = updateSkillDto.display_order;

    const updated = await this.skillRepository.update(id, updateData);

    return {
      id: updated.id,
      title: updated.title_vi,
      description: updated.description_vi,
      icon_url: updated.icon_url,
      highlighted: updated.highlighted,
      display_order: updated.display_order,
      created_at: updated.created_at,
      updated_at: updated.updated_at,
    };
  }

  async remove(id: string): Promise<void> {
    const existing = await this.skillRepository.findOneById(id);
    if (!existing) {
      throw new NotFoundException(`Skill with id "${id}" not found`);
    }

    await this.skillRepository.delete(id);
  }
}

