import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useState, useEffect } from 'react'
import { DiscordUser } from "utils/types";
import { notify } from 'utils/notifications'
import { LoadingComponent } from 'components/LoadingComponent'

interface Props {
  user: DiscordUser;
}
export const SubmitLend: FC<Props> = (props) => {
  const { publicKey } = useWallet();
  const { user } = props;

  const [isLoading, setIsLoading] = useState(true)
  const [availablePackages, setAvailablePackages] = useState(null)
  const [isSubmitting, setisSubmitting] = useState(false)

  useEffect(() => {
    async function fetchAllApi() {
      setIsLoading(true);

      const responseApi1 = await fetch(`https://atadia-lending-api-1.herokuapp.com/api?discordId=${user.id}`);
      const jsonApi1 = await responseApi1.json();

      const listMnplCode = []; 
      const listAgeCode = []; 

      for (const walletAddr of jsonApi1.walletAddr) {
        const responseApi2 = await fetch(`https://atadia-lending-api-2.herokuapp.com/api?walletAddress=${walletAddr}`);
        const jsonApi2 = await responseApi2.json();
        listMnplCode.push(jsonApi2.code);

        const responseApi3 = await fetch(`https://atadia-lending-api-3.herokuapp.com/api?walletAddress=${walletAddr}`);
        const jsonApi3 = await responseApi3.json();
        listAgeCode.push(jsonApi3.walletAge);
      };

      const responsePackages = await fetch(
        `https://atadia-lending-api-4.herokuapp.com/api?walletCode=${listMnplCode}&walletAge=${listAgeCode}`
      );

      const jsonAvailablePackages = await responsePackages.json();

      setAvailablePackages(jsonAvailablePackages);
      setIsLoading(false);
    };
    fetchAllApi();
    console.log(availablePackages)
  }, [])

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    const data = {
      discordId: user.id,
      walletAddress: publicKey!.toBase58(),
      pfpTokenAddress: event.target.pfpTokenAddress.value,
      twitterHandle: event.target.twitterHandle.value,
      loanPackage: parseInt(event.target.loanPackage.value),
      userTimeZoneLong: event.target.userTimeZoneLong.value,
      userTimeZoneShort: 'Blank',
      pohsRecipant: false
    };

    const JSONdata = JSON.stringify(data);

    const endpoint = 'api/LendSubmit';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata
    }

    try {
      setisSubmitting(true);
      const response = await fetch(endpoint, options);
      setisSubmitting(false);

      if (response.status === 200) {
        notify({ type: 'success', message: 'submit successfully, ser!' });
      } else {
        notify({ type: 'error', message: `response status code : ${response.status}` });
      }
    } catch (error) {
      notify({ type: 'error', message: `error : ${error}` });
    }
  }
  
  if (isLoading) return (
  <div className="flex flex-col h-screen">
    <div className='m-auto'>
      <LoadingComponent/>
    </div>
  </div>
  )

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-zinc-800 shadow-md rounded w-1/3 p-7 m-auto">

        <div className="mb-4 w-full">
          <label htmlFor="pfpTokenAddress"
            className="block text-white-700 text-lg mb-2">
            PFP token address:
          </label>
          <input type="text" id="pfpTokenAddress" name="pfpTokenAddress"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-900 
          leading-tight focus:outline-none focus:shadow-outline"
            required />
        </div>

        <div className="mb-4">
          <label htmlFor="twitterHandle"
            className="block text-white-700 text-lg mb-2">
            Twitter handle:
          </label>
          <input type="text" id="twitterHandle" name="twitterHandle"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-900 
          leading-tight focus:outline-none focus:shadow-outline"
            required />
        </div>

        <div className="mb-4">
          <label htmlFor="userTimeZoneLong"
            className="block text-white-700 text-lg mb-2">
            Timezone:
            <select name="userTimeZoneLong" id="userTimeZoneLong"
              className="block appearance-none w-full bg-gray-200 
            border border-gray-200 text-zinc-900 py-3 px-4 pr-8 
            rounded leading-tight focus:outline-none focus:bg-white 
            focus:border-gray-500">
              <option value="UTC-11 to UTC-6">UTC-11 to UTC-6</option>
              <option value="UTC-5 to UTC">UTC-5 to UTC</option>
              <option value="UTC to UTC+6">UTC to UTC+6</option>
              <option value="UTC +7 to UTC+12">UTC +7 to UTC+12</option>
            </select>
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="loanPackage"
            className="block text-white-700 text-lg mb-2">
            Loan package:
            <select name="loanPackage" id="loanPackage"
              className="block appearance-none w-full bg-gray-200 
            border border-gray-200 text-zinc-900 py-3 px-4 pr-8 
            rounded leading-tight focus:outline-none focus:bg-white 
            focus:border-gray-500">
              <option value="2" disabled={!availablePackages["2"]}>
                Loan amount: 1 SOL (you repay 1.05 SOL in 1 week)
              </option>
              <option value="3" disabled={!availablePackages["3"]}>
                Loan amount: 2 SOL (you repay 2.1 SOL in 1 week)
              </option>
              <option value="4" disabled={!availablePackages["4"]}>
                Loan amount: 3 SOL (you repay 3.15 SOL in 1 week)
              </option>
              <option value="5" disabled={!availablePackages["5"]}>
                Loan amount: 4 SOL (you repay 4.2 SOL in 1 week)
              </option>
              <option value="1" disabled={!availablePackages["1"]}>
                Don’t want a loan
              </option>
            </select>
          </label>
        </div>
        <div className="mt-5">
          Note: Some packages may not be available to you.
          Only hit submit if you want the loan and are willing to pay the fee.
          Once you clicked submit, a transfer will be scheduled and cannot be undone.”

        </div>
        <div className="md:flex md:items-center mt-10">
          <div className="m-auto">
            {!publicKey
            ?<button className="text-white bg-gray-400  
            font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            type="submit" disabled={!publicKey}>
              <span> Submit </span>
            </button>
            :<button type="submit" disabled={!publicKey}
              className="text-white bg-gradient-to-br 
            from-purple-600 to-teal-400 hover:bg-gradient-to-bl 
            focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 
            font-medium rounded-lg text-sm px-8 py-2.5 text-center mr-2 mb-2"
            >
              {isSubmitting
                ? <span> Submitting... </span>
                : <span> Submit </span>}
            </button>}
          </div>
        </div>
      </form>
    </div>
  )
}