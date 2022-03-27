import Head from "next/head";
import { VerifyWalletView } from "views";
import { DiscordUser } from "../utils/types";
import { useRouter } from 'next/router'
import { GetServerSideProps } from "next";
import { parseUser } from "../utils/parse-user";

interface Props {
  user: DiscordUser;
}

export default function Index(props: Props) {
  const router = useRouter()
  const { user } = props
  return (
    <div>
      <Head>
        <title>Atadian Loan Lending</title>
        <meta name="description" content="Atadian Loan Lending"/>
      </Head>
      <div className="max-w-xl rounded-lg overflow-hidden bg-zinc-800 p-10">
        <div className="font-bold text-2xl mb-5">◎ Make us trust you</div>
        <p>
          In order to get higher tier loan packages, you need to tell us how many wallets you own. 
          Please follow the following  step before jumping into lending submit process<br />
          <br />
          ◎   Connect your wallet
          <br />
          ◎   Click ***Submit Wallet Address***
          <br />
          ◎   Disconnect your wallet. After that, change your wallet in your browser extention then connect wallet again.
          <br />
          ◎   Again, click ***Submit Wallet Address***
          <br />
          ◎   If you have already add (at least 1) wallet(s), click submit lending in menu bar.
          <br /><br />
          **Note: You have to submit at least 1 wallet that have been created for a while in order to submit for loan lending.**
        </p>
      </div>
      <div className="flex v-screen pt-6">
        <VerifyWalletView user={user}/>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async function (ctx) {
  const user = parseUser(ctx);

  if (!user) {
    return {
      redirect: {
        destination: "/api/oauth",
        permanent: false,
      },
    };
  }

  return { props: { user } };
};

