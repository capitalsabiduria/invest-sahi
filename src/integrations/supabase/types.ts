export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string | null
          monthly_income_range: string | null
          name: string
          phone: string
          preferred_contact: string | null
          preferred_language: string | null
          service_interest: string[] | null
          source: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          monthly_income_range?: string | null
          name: string
          phone: string
          preferred_contact?: string | null
          preferred_language?: string | null
          service_interest?: string[] | null
          source?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          monthly_income_range?: string | null
          name?: string
          phone?: string
          preferred_contact?: string | null
          preferred_language?: string | null
          service_interest?: string[] | null
          source?: string | null
          status?: string | null
        }
        Relationships: []
      }
      calculator_leads: {
        Row: {
          child_age: number | null
          created_at: string | null
          email: string | null
          id: string
          monthly_sip_needed: number | null
          phone: string | null
          target_institution: string | null
          user_monthly_budget: number | null
        }
        Insert: {
          child_age?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          monthly_sip_needed?: number | null
          phone?: string | null
          target_institution?: string | null
          user_monthly_budget?: number | null
        }
        Update: {
          child_age?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          monthly_sip_needed?: number | null
          phone?: string | null
          target_institution?: string | null
          user_monthly_budget?: number | null
        }
        Relationships: []
      }
      content_items: {
        Row: {
          body_en: string | null
          body_or: string | null
          category: string | null
          character_name: string | null
          character_profession_en: string | null
          character_profession_or: string | null
          created_at: string | null
          id: string
          preview_en: string | null
          preview_or: string | null
          published_at: string | null
          slug: string
          status: string | null
          title_en: string | null
          title_or: string | null
          type: string
        }
        Insert: {
          body_en?: string | null
          body_or?: string | null
          category?: string | null
          character_name?: string | null
          character_profession_en?: string | null
          character_profession_or?: string | null
          created_at?: string | null
          id?: string
          preview_en?: string | null
          preview_or?: string | null
          published_at?: string | null
          slug?: string
          status?: string | null
          title_en?: string | null
          title_or?: string | null
          type: string
        }
        Update: {
          body_en?: string | null
          body_or?: string | null
          category?: string | null
          character_name?: string | null
          character_profession_en?: string | null
          character_profession_or?: string | null
          created_at?: string | null
          id?: string
          preview_en?: string | null
          preview_or?: string | null
          published_at?: string | null
          slug?: string
          status?: string | null
          title_en?: string | null
          title_or?: string | null
          type?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          language_preference: string | null
          name: string | null
          source: string | null
          subscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          language_preference?: string | null
          name?: string | null
          source?: string | null
          subscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          language_preference?: string | null
          name?: string | null
          source?: string | null
          subscribed_at?: string | null
        }
        Relationships: []
      }
      page_versions: {
        Row: {
          audience_style: string
          content: Json | null
          created_at: string | null
          id: string
          language: string
          page_id: string
          status: string
          updated_at: string | null
          url_suffix: string
          view_count: number | null
        }
        Insert: {
          audience_style: string
          content?: Json | null
          created_at?: string | null
          id?: string
          language: string
          page_id: string
          status?: string
          updated_at?: string | null
          url_suffix?: string
          view_count?: number | null
        }
        Update: {
          audience_style?: string
          content?: Json | null
          created_at?: string | null
          id?: string
          language?: string
          page_id?: string
          status?: string
          updated_at?: string | null
          url_suffix?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "page_versions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "seo_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_pages: {
        Row: {
          audience_style: string
          content: Json | null
          created_at: string
          id: string
          keywords: string[] | null
          language: string
          meta_description: string | null
          meta_description_or_formal: string | null
          meta_description_or_mixed: string | null
          slug: string
          status: string
          status_override: string | null
          title: string | null
          type: string
          updated_at: string
          view_count: number
        }
        Insert: {
          audience_style?: string
          content?: Json | null
          created_at?: string
          id?: string
          keywords?: string[] | null
          language?: string
          meta_description?: string | null
          meta_description_or_formal?: string | null
          meta_description_or_mixed?: string | null
          slug: string
          status?: string
          status_override?: string | null
          title?: string | null
          type: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          audience_style?: string
          content?: Json | null
          created_at?: string
          id?: string
          keywords?: string[] | null
          language?: string
          meta_description?: string | null
          meta_description_or_formal?: string | null
          meta_description_or_mixed?: string | null
          slug?: string
          status?: string
          status_override?: string | null
          title?: string | null
          type?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_seo_view: { Args: { page_slug: string }; Returns: undefined }
      increment_version_view: {
        Args: {
          p_audience_style: string
          p_language: string
          p_page_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
