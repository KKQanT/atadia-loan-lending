import { useWallet } from "@solana/wallet-adapter-react";
import {FC, useState, useEffect} from 'react'
import { DiscordUser } from "utils/types";

interface Props {
  user: DiscordUser;
  availablePackages: any;
}
export const SubmitLend: FC<Props> = (props) => {
  const {publicKey} = useWallet();
  const {user, availablePackages} = props;
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
      pohsRecipant:true
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
      const response = await fetch(endpoint, options);

      if (response.status === 200) {
        alert('submitted!')
      } else {
        alert('something wrong')
      }
    } catch (error) {
      alert('cannot send data')
    }
  }
  
  //fetchPackages(user)

  return (
    <div>
      <form onSubmit={handleSubmit}>
        
        <div>
          <label htmlFor="pfpTokenAddress">PFP token address: </label>
          <input type="text" id="pfpTokenAddress" name="pfpTokenAddress" required/>
        </div>
        
        <div>
          <label htmlFor="twitterHandle">Twitter handle: </label>
          <input type="text" id="twitterHandle" name="twitterHandle" required/>
        </div>
        <div>
          <label htmlFor="loanPackage">
            Loan package: 
            <select name="loanPackage" id="loanPackage">
              <option value="1" disabled={!availablePackages["1"]}>package 1</option>
              <option value="2" disabled={!availablePackages["2"]} >package 2</option>
              <option value="3" disabled={!availablePackages["3"]}>package 3</option>
              <option value="4" disabled={!availablePackages["4"]}>package 4</option>
              <option value="5" disabled={!availablePackages["5"]}>package 5</option>
              <option value="6" disabled={!availablePackages["6"]}>package 6</option>
            </select>
          </label>
        </div>

        <div>
          <label htmlFor="userTimeZoneLong">
            Timezone: 
            <select name="userTimeZoneLong" id="userTimeZoneLong">
              <option value="UTC-11 to UTC-6">UTC-11 to UTC-6</option>
              <option value="UTC-5 to UTC">UTC-5 to UTC</option>
              <option value="UTC to UTC+6">UTC to UTC+6</option>
              <option value="UTC +7 to UTC+12">UTC +7 to UTC+12</option>
            </select>
          </label>
        </div>

        <button type="submit" disabled={!publicKey}>Submit</button>
        
      </form>
    </div>
  )
}