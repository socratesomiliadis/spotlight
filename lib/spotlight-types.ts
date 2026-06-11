export type CategoryType =
  | "websites"
  | "design"
  | "films"
  | "crypto"
  | "startups"
  | "ai"

export type AwardType = "otd" | "otm" | "oty" | "honorable"

export type SocialsView = {
  user_id: string
  created_at?: string
  instagram: string | null
  linked_in: string | null
  twitter: string | null
}

export type ProfileSummaryView = {
  user_id: string
  username: string
  display_name: string | null
  avatar_url: string | null
}

export type AwardView = {
  id?: string
  project_id: string
  award_type: AwardType
  awarded_at: string
  created_at: string
}

export type ProjectCardView = {
  id: string
  _id?: string
  user_id: string
  title: string
  slug: string
  category: CategoryType
  tags: string[]
  main_img_url: string
  preview_url: string | null
  created_at: string
  profile?: ProfileSummaryView | null
  user?: ProfileSummaryView | null
  award?: AwardView[]
}

export type StaffProjectRowView = ProjectCardView & {
  award?: AwardView[]
}

export type ProfileView = {
  id?: string
  user_id: string
  email: string
  username: string
  display_name: string | null
  business_type?: string
  location: string | null
  website_url: string | null
  avatar_url: string | null
  banner_url: string | null
  role?: string
  is_unclaimed: boolean
  public_metadata?: unknown
  created_at: string
  updated_at: string
  socials?: SocialsView | null
  project?: ProjectCardView[] | ProjectView[] | null
}

export type ProjectView = {
  id: string
  _id?: string
  user_id: string
  title: string
  slug: string
  category: CategoryType
  tags: string[]
  live_url: string | null
  main_img_url: string
  main_image_storage_id?: string | null
  banner_url: string
  banner_storage_id?: string | null
  preview_url: string | null
  preview_storage_id?: string | null
  elements_url: string[] | null
  element_storage_ids?: string[]
  created_at: string
  updated_at?: string
  profile?: ProfileView | null
  user?: ProfileView | null
  award?: AwardView[]
}
