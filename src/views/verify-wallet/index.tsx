import { FC } from 'react'
import { VerifyWallet } from 'components/VerifyWallet';
import { DiscordUser } from "utils/types";

interface Props {
  user: DiscordUser;
}

export const VerifyWalletView: FC<Props> = (props:Props) => {
  const { user } = props;
  return (
    <div>
      <VerifyWallet user={user} />
    </div>
  )
}
