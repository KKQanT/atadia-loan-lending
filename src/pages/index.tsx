import type { NextPage } from "next";
import Head from "next/head";
import { FormView } from "views";
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
      <h1>
        hey, {user.username}#{user.discriminator}
        <h2>
          email: {user.email}
          <h3>
            guildsName: {user.guildsName}
          </h3>
        </h2>
      </h1>
      <FormView user={user}/>
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

