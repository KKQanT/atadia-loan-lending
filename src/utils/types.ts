export interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number | null;
  flags: number | null;
  locale: string | null;
  mfa_enabled: boolean | null;
  premium_type: number | null;
  email: string | null
}
