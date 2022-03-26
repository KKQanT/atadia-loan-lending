import { FC } from "react";
import { SubmitLend } from "components/SubmitLend";
import { DiscordUser } from "utils/types";

interface Props {
  user: DiscordUser;
  availablePackages: any;
}

export const SubmitLendView: FC<Props> = (props:Props) => {
  const { user, availablePackages } = props;
  return (
    <div>
      <SubmitLend user={user} availablePackages={availablePackages}/>
    </div>
  )
}