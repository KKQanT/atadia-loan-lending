import Head from "next/head";
import { SubmitLendView } from "views";
import { DiscordUser } from "../utils/types";
import { useRouter } from 'next/router'
import { GetServerSideProps } from "next";
import { parseUser } from "../utils/parse-user";

interface Props {
  user: DiscordUser;
  availablePackages: any;
}

export default function LendSubmit(props:Props) {
  const router = useRouter()
  const { user, availablePackages } = props
  return (
    <div className="w-full">
      <Head>
        <title>Atadian Loan Lending</title>
        <meta name="description" content="Atadian Loan Lending"/>
      </Head>
      <SubmitLendView user={user} availablePackages={availablePackages}/>
    </div>
  )
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

  const responsePackages = await fetch(
    `https://atadia-pfpscore-api.herokuapp.com/api?discordId=${user.id}`
    );

  const availablePackages = await responsePackages.json();

  return { props: { user, availablePackages } };
};