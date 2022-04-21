import { PublicKey } from "@solana/web3.js"
import { programs } from "@metaplex/js"


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

export type NFT = {
  pubkey?: PublicKey
  mint: PublicKey
  onchainMetadata: programs.metadata.MetadataData
  externalMetadata: {
    attributes: Array<any>
    collection: any
    description: string
    edition: number
    external_url: string
    image: string
    name: string
    properties: {
      files: Array<string>
      category: string
      creators: Array<string>
    }
    seller_fee_basis_points: number
  }
}