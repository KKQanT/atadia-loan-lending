import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useState } from 'react';
import { DiscordUser } from "utils/types";
import { notify } from "../utils/notifications"

interface Props {
  user: DiscordUser;
}

export const VerifyWallet: FC<Props> = (props) => {
  const {publicKey} = useWallet();
  const { user } = props;
  const [ isLoading, setIsLoading ] = useState(null)

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
      setIsLoading(true);
      const response = await fetch(endpoint, options);
      setIsLoading(false);

      if (response.status === 200) {
        notify({type:'success', message:'wallet added!, ser! change your wallet and add again or go submit lending'});
      } else {
        notify({type:'error', message: `response status code : ${response.status}`});
      }
    } catch (error) {
      notify({type:'error', message: `error : ${error}`});
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button className="text-white bg-gradient-to-br 
      from-purple-600 to-teal-400 hover:bg-gradient-to-bl 
      focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 
      font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
      type="submit" disabled={!publicKey}>
        {isLoading
        ?<span> Submitting... </span> 
        :<span> Add Wallet </span>}
      </button>
    </form>
  )
}
