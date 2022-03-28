import { FC } from "react";
import { SubmitLend } from "components/SubmitLend";
import { DiscordUser } from "utils/types";

interface Props {
  user: DiscordUser;
}

export const SubmitLendView: FC<Props> = (props:Props) => {
  const { user} = props;
  return (
    <div className="w-full">
      <SubmitLend user={user}/>
    </div>
  )
}