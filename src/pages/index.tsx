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
      <div className="max-w-3xl rounded-lg overflow-hidden bg-zinc-800 p-10">
        <div className="font-bold text-2xl mb-5">Welcome to “The Atadia Lending Lab”</div>
        <br />

        <b>
            Baseline info on our loan terms
        </b>
        <br />
        <p>
          <b>◎ Duration:</b> 1 week (e.g. If you received our loan on Monday 11am your time, pay back to us by your 11am next Monday)
          <br />
          <b>◎ Convenience fee:</b> 5% over the loan duration
          <br />
          <b>◎ Loan amounts</b> vary depending on your data (your MNPL track records, the number of wallets you provide, the age of the wallets, etc.)
        </p>

        <br /><br />
        <b>
          If you’re interested in getting a loan, please follow these key steps:
        </b>
        <br />
        <p>
          ◎ Connect wallets on this page <br />
          ◎ Submit loan application 
        </p>
        <br /><br />

        <b>
          Conditions:
        </b>
        <br />
        <p>
          <b>◎ Connecting multiple wallets </b> 
          will increase the amount of your loan offer, but this will be considered 
          in conjunction with the rest of your data. You can connect as many wallets 
          as you like and help us trust you :)
        </p>
        <p>
          <b>◎ New wallets don’t count!</b> By new we mean less 7 days old!! <br />
          - If you provide only 1 wallet and it is new, you will not be offered a loan <br />
          - If you connect multiple wallets, new wallets will not contribute to your application.
        </p>
        <br />

        <b>
          How to connect wallets?
        </b>
        <p>
          ◎ Sign into the wallet of your choice on your browser extension. <br />
          ◎ Hit “SELECT WALLET” on the top right corner and connect the wallet. <br />
          ◎ Hit “Submit Wallet Address” - this means we’ll consider this wallet in your loan application! <br />
          ◎ To connect another wallet, disconnect the current wallet by clicking on your current wallet and then “Disconnect” <br />
          ◎ Switch to the next wallet on your browser extension. <br />
          ◎ Connect again and hit  “Submit Wallet Address” <br />
          ◎ Every wallet successfully submitted will contribute to your loan application except those younger than 7-day-old! <br />

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

