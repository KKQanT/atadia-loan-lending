export interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  email: string;
  guildsName: string;
  guildsId: string;
  public_flags: number;
  flags: number;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
}
