import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../config/supabase.config';
import { Skill } from '../entities';

interface SkillRow {
  id: string;
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  icon_url: string | null;
  highlighted: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class SkillRepository {
  private supabase: SupabaseClient;

  constructor(private supabaseConfig: SupabaseConfig) {
    this.supabase = supabaseConfig.getClient();
  }

  /**
   * Find all skills, ordered by display_order
   */
  async findAll(): Promise<Skill[]> {
    const { data, error } = await this.supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch skills: ${error.message}`);
    }

    return (data || []).map((row: SkillRow) => this.mapSkillRow(row));
  }

  /**
   * Find a skill by ID
   */
  async findOneById(id: string): Promise<Skill | null> {
    const { data, error } = await this.supabase
      .from('skills')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch skill: ${error.message}`);
    }

    return this.mapSkillRow(data);
  }

  /**
   * Find a skill by slug (generated from title)
   * Note: Since we don't have a slug column, we'll search by matching title
   * This is a simple implementation - in production, consider adding a slug column
   */
  async findBySlug(slug: string, lang: 'vi' | 'en' = 'vi'): Promise<Skill | null> {
    const titleColumn = lang === 'vi' ? 'title_vi' : 'title_en';
    
    // Get all skills and find by matching slug
    const { data, error } = await this.supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch skills: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return null;
    }

    // Find skill where title matches the slug
    const skill = data.find((row: SkillRow) => {
      const title = row[titleColumn];
      if (!title) return false;
      
      // Simple slug matching - convert title to slug and compare
      const titleSlug = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      return titleSlug === slug;
    });

    return skill ? this.mapSkillRow(skill) : null;
  }

  /**
   * Create a new skill
   */
  async create(skill: Partial<Skill>): Promise<Skill> {
    const { data, error } = await this.supabase
      .from('skills')
      .insert({
        title_vi: skill.title_vi,
        title_en: skill.title_en,
        description_vi: skill.description_vi,
        description_en: skill.description_en,
        icon_url: skill.icon_url || null,
        highlighted: skill.highlighted || false,
        display_order: skill.display_order || 0,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create skill: ${error.message}`);
    }

    return this.mapSkillRow(data);
  }

  /**
   * Update a skill
   */
  async update(id: string, skill: Partial<Skill>): Promise<Skill> {
    const updateData: any = {};
    if (skill.title_vi !== undefined) updateData.title_vi = skill.title_vi;
    if (skill.title_en !== undefined) updateData.title_en = skill.title_en;
    if (skill.description_vi !== undefined) updateData.description_vi = skill.description_vi;
    if (skill.description_en !== undefined) updateData.description_en = skill.description_en;
    if (skill.icon_url !== undefined) updateData.icon_url = skill.icon_url;
    if (skill.highlighted !== undefined) updateData.highlighted = skill.highlighted;
    if (skill.display_order !== undefined) updateData.display_order = skill.display_order;

    const { data, error } = await this.supabase
      .from('skills')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException(`Skill with id "${id}" not found`);
      }
      throw new Error(`Failed to update skill: ${error.message}`);
    }

    return this.mapSkillRow(data);
  }

  /**
   * Delete a skill
   */
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('skills').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete skill: ${error.message}`);
    }
  }

  /**
   * Map database row to Skill entity
   */
  private mapSkillRow(row: SkillRow): Skill {
    return {
      id: row.id,
      title_vi: row.title_vi,
      title_en: row.title_en,
      description_vi: row.description_vi,
      description_en: row.description_en,
      icon_url: row.icon_url,
      highlighted: row.highlighted,
      display_order: row.display_order,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }
}

