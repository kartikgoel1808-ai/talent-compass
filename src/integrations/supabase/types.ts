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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          company_id: number
          created_at: string | null
          name: string
        }
        Insert: {
          company_id?: number
          created_at?: string | null
          name: string
        }
        Update: {
          company_id?: number
          created_at?: string | null
          name?: string
        }
        Relationships: []
      }
      company_skill_levels: {
        Row: {
          company_id: number
          created_at: string | null
          id: number
          required_level: number
          required_proficiency_level_id: number
          skill_set_id: number
        }
        Insert: {
          company_id: number
          created_at?: string | null
          id?: number
          required_level: number
          required_proficiency_level_id: number
          skill_set_id: number
        }
        Update: {
          company_id?: number
          created_at?: string | null
          id?: number
          required_level?: number
          required_proficiency_level_id?: number
          skill_set_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_skill_levels_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_skill_levels_required_proficiency_level_id_fkey"
            columns: ["required_proficiency_level_id"]
            isOneToOne: false
            referencedRelation: "proficiency_levels"
            referencedColumns: ["proficiency_level_id"]
          },
          {
            foreignKeyName: "company_skill_levels_skill_set_id_fkey"
            columns: ["skill_set_id"]
            isOneToOne: false
            referencedRelation: "skill_set_master"
            referencedColumns: ["skill_set_id"]
          },
        ]
      }
      proficiency_levels: {
        Row: {
          proficiency_code: string
          proficiency_description: string | null
          proficiency_level_id: number
          proficiency_name: string
        }
        Insert: {
          proficiency_code: string
          proficiency_description?: string | null
          proficiency_level_id: number
          proficiency_name: string
        }
        Update: {
          proficiency_code?: string
          proficiency_description?: string | null
          proficiency_level_id?: number
          proficiency_name?: string
        }
        Relationships: []
      }
      skill_set_master: {
        Row: {
          short_name: string
          skill_set_description: string | null
          skill_set_id: number
          skill_set_name: string
        }
        Insert: {
          short_name: string
          skill_set_description?: string | null
          skill_set_id?: number
          skill_set_name: string
        }
        Update: {
          short_name?: string
          skill_set_description?: string | null
          skill_set_id?: number
          skill_set_name?: string
        }
        Relationships: []
      }
      skill_set_topics: {
        Row: {
          created_at: string | null
          level_number: number
          skill_set_id: number
          topic_id: number
          topics: string
        }
        Insert: {
          created_at?: string | null
          level_number: number
          skill_set_id: number
          topic_id?: number
          topics: string
        }
        Update: {
          created_at?: string | null
          level_number?: number
          skill_set_id?: number
          topic_id?: number
          topics?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_set_topics_skill_set_id_fkey"
            columns: ["skill_set_id"]
            isOneToOne: false
            referencedRelation: "skill_set_master"
            referencedColumns: ["skill_set_id"]
          },
        ]
      }
      staging_company_skill_levels: {
        Row: {
          ai_native_engineering: string | null
          aptitude_and_problem_solving: string | null
          coding: string | null
          communication_skills: string | null
          companies: string
          computer_networking: string | null
          created_at: string | null
          data_structures_and_algorithms: string | null
          devops_and_cloud: string | null
          error_message: string | null
          id: number
          object_oriented_programming_and_design: string | null
          operating_system: string | null
          processed: boolean | null
          processed_at: string | null
          software_engineering: string | null
          sql_and_design: string | null
          system_design_and_architecture: string | null
        }
        Insert: {
          ai_native_engineering?: string | null
          aptitude_and_problem_solving?: string | null
          coding?: string | null
          communication_skills?: string | null
          companies: string
          computer_networking?: string | null
          created_at?: string | null
          data_structures_and_algorithms?: string | null
          devops_and_cloud?: string | null
          error_message?: string | null
          id?: number
          object_oriented_programming_and_design?: string | null
          operating_system?: string | null
          processed?: boolean | null
          processed_at?: string | null
          software_engineering?: string | null
          sql_and_design?: string | null
          system_design_and_architecture?: string | null
        }
        Update: {
          ai_native_engineering?: string | null
          aptitude_and_problem_solving?: string | null
          coding?: string | null
          communication_skills?: string | null
          companies?: string
          computer_networking?: string | null
          created_at?: string | null
          data_structures_and_algorithms?: string | null
          devops_and_cloud?: string | null
          error_message?: string | null
          id?: number
          object_oriented_programming_and_design?: string | null
          operating_system?: string | null
          processed?: boolean | null
          processed_at?: string | null
          software_engineering?: string | null
          sql_and_design?: string | null
          system_design_and_architecture?: string | null
        }
        Relationships: []
      }
      staging_skill_topics: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: number
          levels: string
          processed: boolean | null
          processed_at: string | null
          skill_area: string
          topics: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: number
          levels: string
          processed?: boolean | null
          processed_at?: string | null
          skill_area: string
          topics: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: number
          levels?: string
          processed?: boolean | null
          processed_at?: string | null
          skill_area?: string
          topics?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_or_create_company: {
        Args: { company_name_input: string }
        Returns: number
      }
      get_proficiency_level_id: { Args: { prof_code: string }; Returns: number }
      get_skill_set_id: { Args: { skill_name: string }; Returns: number }
      parse_level_number: { Args: { level_text: string }; Returns: number }
      parse_skill_value: {
        Args: { skill_value: string }
        Returns: {
          proficiency_code: string
          required_level: number
        }[]
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
