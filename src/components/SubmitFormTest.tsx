import { useWallet } from "@solana/wallet-adapter-react";
import { FC } from 'react';
import { DiscordUser } from "utils/types";

interface Props {
  user: DiscordUser;
}

export const SubmitFormTest: FC<Props> = (props) => {
  
  const {publicKey} = useWallet();
  const { user } = props
  user.id

  const handleSubmit = async (event:any) => {
    event.preventDefault()

    const data = {
      //first: event.target.first.value,
      discorduser : user.username,
      walletAddress: publicKey!.toBase58()
    };

    const JSONdata = JSON.stringify(data);

    const endpoint = 'api/FormTest2';

    const options = {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata
    }

    try {
      const response = await fetch(endpoint, options);
      
      if (response.status === 200) {
        console.log('submitted')
      } else {
        console.log('not 200')
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="first">First Name</label>
      <input type='text' id='first' name='first' required/>
      
      <label htmlFor="last">Last Name</label>
      <input type="text" id='last' name='last' required/>

      <button type="submit" disabled={!publicKey}>Submit</button>
    </form>
  )
}

