interface discordParams {
  guildId: string
}

interface discordData {
  id: string
  name: string
  icon: string | null
  description: string | null
  home_header: string | null
  splash: string | null
  discovery_splash: string | null
  features: Array
  banner: string | null
  owner_id: string
  application_id: string | null
  region: string
  afk_channel_id: string
  afk_timeout: number
  system_channel_id: string
  system_channel_flags: number
  widget_enabled: boolean
  widget_channel_id: string | null
  verification_level: number
  roles: Array
  default_message_notifications: number
  mfa_level: number
  explicit_content_filter: number
  max_presences: string | null
  max_members: number
  max_stage_video_channel_users: number
  max_video_channel_users: number
  vanity_url_code: string | null
  premium_tier: number
  premium_subscription_count: number
  preferred_locale: string
  rules_channel_id: string | null
  safety_alerts_channel_id: string | null
  public_updates_channel_id: string | null
  hub_type: string | null
  premium_progress_bar_enabled: boolean
  latest_onboarding_question_id: string | null
  nsfw: string | null
  nsfw_level: number
  emojis: Array
  stickers: Array
  incidents_data: string | null
  inventory_settings: string | null
  embed_enabled: boolean
  embed_channel_id: string | null
  approximate_member_count: number
  approximate_presence_count: number
}
