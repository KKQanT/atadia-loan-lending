import { useWallet } from "@solana/wallet-adapter-react";
import { FC } from 'react';
import { DiscordUser } from "utils/types";

interface Props {
  user: DiscordUser;
}

export const VerifyWallet: FC<Props> = (props) => {
  const {publicKey} = useWallet();
  const { user } = props;

  const handleSubmit = async (event:any) => {
    event.preventDefault();

    const data = {
      discordId: user.id,
      walletAddress: publicKey!.toBase58(),
      discordUsername: user.username,
      discordDiscriminator: user.discriminator,
      discordEmail: user.email,
      discordLocale: user.locale,
      discordPremiumType: user.premium_type,
      discordFlag: user.flags,
      discordPublicFlag: user.public_flags,
      discortMfaEnable: user.mfa_enabled,
      joinedServerId:user.guildsId,
      joinedServerName: user.guildsName
    };

    const JSONdata = JSON.stringify(data);

    const endpoint = 'api/VerifyWallet'

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata
    }

    try {
      const response = await fetch(endpoint, options);

      if (response.status === 200) {
        console.log('submitted');
        alert('Wallet Added to our Database! Pls change your wallet if you wanna add another one!')
      } else {
        console.log('not 200');
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={!publicKey}>Add Wallet</button>
    </form>
  )
}
