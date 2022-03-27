import { useWallet } from "@solana/wallet-adapter-react";
import {FC, useState, useEffect} from 'react'
import { DiscordUser } from "utils/types";
import { notify } from 'utils/notifications'

interface Props {
  user: DiscordUser;
  availablePackages: any;
}
export const SubmitLend: FC<Props> = (props) => {
  const {publicKey} = useWallet();
  const {user, availablePackages} = props;
  const [ isLoading, setIsLoading ] = useState(null)
  console.log(availablePackages)

  const handleSubmit = async (event:any) => {
    event.preventDefault()

    const data = {
      discordId: user.id,
      walletAddress: publicKey!.toBase58(),
      pfpTokenAddress: event.target.pfpTokenAddress.value,
      twitterHandle: event.target.twitterHandle.value,
      loanPackage: parseInt(event.target.loanPackage.value),
      userTimeZoneLong:event.target.userTimeZoneLong.value,
      userTimeZoneShort:'Blank',
      pohsRecipant:false
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
      setIsLoading(true);
      const response = await fetch(endpoint, options);
      setIsLoading(false);

      if (response.status === 200) {
        notify({type:'success', message:'submit successfully, ser!'});
      } else {
        notify({type:'error', message: `response status code : ${response.status}`});
      }
    } catch (error) {
      notify({type:'error', message: `error : ${error}`});
    }
  }
  
  //fetchPackages(user)

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
          required/>
        </div>
        
        <div className="mb-4">
          <label htmlFor="twitterHandle"
          className="block text-white-700 text-lg mb-2">
            Twitter handle: 
          </label>
          <input type="text" id="twitterHandle" name="twitterHandle" 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-900 
          leading-tight focus:outline-none focus:shadow-outline"
          required/>
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
                Lend : 1◎   Duration : 1 week   Repay: 1.05◎
              </option>
              <option value="3" disabled={!availablePackages["3"]}>
                Lend : 2◎   Duration : 1 week   Repay: 2.1◎
              </option>
              <option value="4" disabled={!availablePackages["4"]}>
                Lend : 3◎   Duration : 1 week   Repay: 3.15◎
              </option>
              <option value="5" disabled={!availablePackages["5"]}>
                Lend : 4◎   Duration : 1 week   Repay: 2.2◎
              </option>
              <option value="1" disabled={!availablePackages["1"]}>
                Don’t want a loan
              </option>
            </select>
          </label>
        </div>
        <div className="mt-5">
          Note: Some package might not be available for you based on judgment
        </div>
        <div className="md:flex md:items-center mt-10">
          <div className="m-auto">
            <button type="submit" disabled={!publicKey}
            className="text-white bg-gradient-to-br 
            from-purple-600 to-teal-400 hover:bg-gradient-to-bl 
            focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 
            font-medium rounded-lg text-sm px-8 py-2.5 text-center mr-2 mb-2"
            >
              {isLoading
                ?<span> Submitting... </span> 
                :<span> Submit </span>}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}