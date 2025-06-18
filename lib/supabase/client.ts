import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/database.types";

export const createClient = ({ session }: { session: any }) =>
  createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      async accessToken() {
        return session?.getToken() ?? null;
      },
    }
  );
