/**
 * Skill entity - matches Supabase skills table
 */
export class Skill {
  id: string;
  title_vi: string;
  title_en: string;
  description_vi: string;
  description_en: string;
  icon_url: string | null;
  highlighted: boolean;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

