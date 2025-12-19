import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseConfig {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://tixmpgpsfflupbyyuvfg.supabase.co';
    const supabaseKey =
      process.env.SUPABASE_ANON_KEY ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpeG1wZ3BzZmZsdXBieXl1dmZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzA1NzYsImV4cCI6MjA3MTAwNjU3Nn0.wyOSUU1DBg9Yp9z-6NmcxPRx2Z6x_3G5Svh7bvcONKA';

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}

