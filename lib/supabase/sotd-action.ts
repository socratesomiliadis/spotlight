"use server";

import { createAdminClient } from "./server";

export async function setSotd(projectId: number) {
  const supabaseServerClient = await createAdminClient();
  const { error } = await supabaseServerClient
    .from("sotdtemp")
    .update({ project_id: projectId })
    .eq("id", "sotd");
  if (error) throw error;
  console.log(`Sotd set to project: ${projectId}`);
}
