export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      award: {
        Row: {
          award_type: Database["public"]["Enums"]["awards"]
          awarded_at: string
          created_at: string
          id: string
          project_id: string
        }
        Insert: {
          award_type: Database["public"]["Enums"]["awards"]
          awarded_at: string
          created_at?: string
          id?: string
          project_id: string
        }
        Update: {
          award_type?: Database["public"]["Enums"]["awards"]
          awarded_at?: string
          created_at?: string
          id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "award_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          following_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          following_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          following_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "follows_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profile: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          business_type: string
          created_at: string
          display_name: string | null
          email: string
          is_unclaimed: boolean
          location: string | null
          public_metadata: Json | null
          updated_at: string
          user_id: string
          username: string
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          business_type?: string
          created_at?: string
          display_name?: string | null
          email: string
          is_unclaimed?: boolean
          location?: string | null
          public_metadata?: Json | null
          updated_at?: string
          user_id: string
          username: string
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          business_type?: string
          created_at?: string
          display_name?: string | null
          email?: string
          is_unclaimed?: boolean
          location?: string | null
          public_metadata?: Json | null
          updated_at?: string
          user_id?: string
          username?: string
          website_url?: string | null
        }
        Relationships: []
      }
      project: {
        Row: {
          banner_url: string
          category: Database["public"]["Enums"]["category"]
          created_at: string
          elements_url: string[] | null
          id: string
          live_url: string | null
          main_img_url: string
          preview_url: string | null
          slug: string
          tags: string[]
          title: string
          user_id: string
        }
        Insert: {
          banner_url: string
          category: Database["public"]["Enums"]["category"]
          created_at?: string
          elements_url?: string[] | null
          id?: string
          live_url?: string | null
          main_img_url: string
          preview_url?: string | null
          slug: string
          tags: string[]
          title: string
          user_id: string
        }
        Update: {
          banner_url?: string
          category?: Database["public"]["Enums"]["category"]
          created_at?: string
          elements_url?: string[] | null
          id?: string
          live_url?: string | null
          main_img_url?: string
          preview_url?: string | null
          slug?: string
          tags?: string[]
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["user_id"]
          },
        ]
      }
      socials: {
        Row: {
          created_at: string
          instagram: string | null
          linked_in: string | null
          twitter: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          instagram?: string | null
          linked_in?: string | null
          twitter?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          instagram?: string | null
          linked_in?: string | null
          twitter?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "socials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profile"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      slugify: {
        Args: { value: string }
        Returns: string
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
    }
    Enums: {
      awards: "otd" | "otm" | "oty" | "honorable"
      category: "websites" | "design" | "films" | "crypto" | "startups" | "ai"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      awards: ["otd", "otm", "oty", "honorable"],
      category: ["websites", "design", "films", "crypto", "startups", "ai"],
    },
  },
} as const
