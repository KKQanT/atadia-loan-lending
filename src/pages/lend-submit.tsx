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

  const responseApi1 = await fetch(
    `https://atadia-lending-api-1.herokuapp.com/api?discordId=${user.id}`
  );
  
  const api1 = await responseApi1.json();

  const outputApi2List = []; 
  const outputApi3List = []; 

  for (const api1Item of api1.walletAddr) {
    
    const responseApi2 = await fetch(
      `https://atadia-lending-api-2.herokuapp.com/api?walletAddress=${api1Item}`
    );
    const api2 = await responseApi2.json();
    outputApi2List.push(api2.code);

    const responseApi3 = await fetch(
      `https://atadia-lending-api-3.herokuapp.com/api?walletAddress=${api1Item}`
    )
    const api3 = await responseApi3.json();
    outputApi3List.push(api3.walletAge)
  };

  const responsePackages = await fetch(
    `https://atadia-lending-api-4.herokuapp.com/api?walletCode=${outputApi2List}&walletAge=${outputApi3List}`
  )

  const availablePackages = await responsePackages.json()
  

  return { props: { user, availablePackages } };
};