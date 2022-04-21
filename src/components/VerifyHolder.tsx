import { PublicKey } from "@solana/web3.js";
import { programs } from "@metaplex/js";
import { useState } from "react";
import { getNFTsByOwner } from "utils/nft";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { DiscordUser, NFT } from "utils/types";
import { FC } from 'react'

interface Props {
  user : DiscordUser;
}

export const VerifyHolder: FC<Props> = (props) => {
 
  return (
    <div>
      "VerifyHolder"
    </div>
  )

};