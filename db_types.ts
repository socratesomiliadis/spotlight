export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          stripe_customer_id: string | null;
        };
        Insert: {
          id: string;
          stripe_customer_id?: string | null;
        };
        Update: {
          id?: string;
          stripe_customer_id?: string | null;
        };
      };
      prices: {
        Row: {
          active: boolean | null;
          currency: string | null;
          description: string | null;
          id: string;
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null;
          interval_count: number | null;
          metadata: Json | null;
          product_id: string | null;
          trial_period_days: number | null;
          type: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount: number | null;
        };
        Insert: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id: string;
          interval?:
            | Database["public"]["Enums"]["pricing_plan_interval"]
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount?: number | null;
        };
        Update: {
          active?: boolean | null;
          currency?: string | null;
          description?: string | null;
          id?: string;
          interval?:
            | Database["public"]["Enums"]["pricing_plan_interval"]
            | null;
          interval_count?: number | null;
          metadata?: Json | null;
          product_id?: string | null;
          trial_period_days?: number | null;
          type?: Database["public"]["Enums"]["pricing_type"] | null;
          unit_amount?: number | null;
        };
      };
      products: {
        Row: {
          active: boolean | null;
          description: string | null;
          id: string;
          image: string | null;
          metadata: Json | null;
          name: string | null;
        };
        Insert: {
          active?: boolean | null;
          description?: string | null;
          id: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
        Update: {
          active?: boolean | null;
          description?: string | null;
          id?: string;
          image?: string | null;
          metadata?: Json | null;
          name?: string | null;
        };
      };
      profile: {
        Row: {
          avatar_url: string | null;
          banner_url: string | null;
          created_at: string | null;
          display_name: string | null;
          location: string | null;
          occupation: string | null;
          tagline: string | null;
          updated_at: string | null;
          user_id: string;
          username: string;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          banner_url?: string | null;
          created_at?: string | null;
          display_name?: string | null;
          location?: string | null;
          occupation?: string | null;
          tagline?: string | null;
          updated_at?: string | null;
          user_id: string;
          username: string;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          banner_url?: string | null;
          created_at?: string | null;
          display_name?: string | null;
          location?: string | null;
          occupation?: string | null;
          tagline?: string | null;
          updated_at?: string | null;
          user_id?: string;
          username?: string;
          website?: string | null;
        };
      };
      relationships: {
        Row: {
          created_at: string | null;
          follower_id: string | null;
          following_id: string | null;
          id: string;
        };
        Insert: {
          created_at?: string | null;
          follower_id?: string | null;
          following_id?: string | null;
          id: string;
        };
        Update: {
          created_at?: string | null;
          follower_id?: string | null;
          following_id?: string | null;
          id?: string;
        };
      };
      socials: {
        Row: {
          behance: string | null;
          created_at: string | null;
          instagram: string | null;
          linkedin: string | null;
          read_cv: string | null;
          twitter: string | null;
          user_id: string;
        };
        Insert: {
          behance?: string | null;
          created_at?: string | null;
          instagram?: string | null;
          linkedin?: string | null;
          read_cv?: string | null;
          twitter?: string | null;
          user_id: string;
        };
        Update: {
          behance?: string | null;
          created_at?: string | null;
          instagram?: string | null;
          linkedin?: string | null;
          read_cv?: string | null;
          twitter?: string | null;
          user_id?: string;
        };
      };
      subscriptions: {
        Row: {
          cancel_at: string | null;
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          created: string;
          current_period_end: string;
          current_period_start: string;
          ended_at: string | null;
          id: string;
          metadata: Json | null;
          price_id: string | null;
          quantity: number | null;
          status: Database["public"]["Enums"]["subscription_status"] | null;
          trial_end: string | null;
          trial_start: string | null;
          user_id: string;
        };
        Insert: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database["public"]["Enums"]["subscription_status"] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id: string;
        };
        Update: {
          cancel_at?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          created?: string;
          current_period_end?: string;
          current_period_start?: string;
          ended_at?: string | null;
          id?: string;
          metadata?: Json | null;
          price_id?: string | null;
          quantity?: number | null;
          status?: Database["public"]["Enums"]["subscription_status"] | null;
          trial_end?: string | null;
          trial_start?: string | null;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      requesting_user_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year";
      pricing_type: "one_time" | "recurring";
      subscription_status:
        | "trialing"
        | "active"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "past_due"
        | "unpaid"
        | "paused";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
