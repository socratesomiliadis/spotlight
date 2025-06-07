import { createAdminClient } from "./server";

export async function upsertUser(data: any) {
  const supabaseServerClient = await createAdminClient();
  const fullName = `${data.first_name} ${data.last_name}`;
  const emails = data.email_addresses;
  const primaryEmailId = data.primary_email_address_id;
  const primaryEmail = emails.find((email: any) => email.id === primaryEmailId);

  const userData = {
    user_id: data.id,
    username: data.username,
    display_name: fullName,
    avatar_url: data.image_url,
    email: primaryEmail.email_address,
  };
  const { error } = await supabaseServerClient
    .from("profile")
    .upsert(userData, {
      onConflict: "user_id",
    });
  if (error) throw error;
  console.log(`User inserted/updated: ${data.id}`);
}

export async function deleteUser(id: string) {
  const supabaseServerClient = await createAdminClient();
  const { error } = await supabaseServerClient
    .from("profile")
    .delete()
    .eq("user_id", id);
  if (error) throw error;
  console.log(`User deleted: ${id}`);
}
