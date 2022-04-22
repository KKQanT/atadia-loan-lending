import { FC, useState } from "react";
import { SubmitLend } from "components/SubmitLend";
import { DiscordUser } from "utils/types";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { NFT } from "../../utils/types"
import { getNFTsMintAddress } from "../../utils/nft"

interface Props {
  user: DiscordUser;
}

export const SubmitLendView: FC<Props> = (props:Props) => {
  const { user} = props;
  const { publicKey } = useWallet();
  const [askedHolder, setaskedHolder] = useState(false);
  const [verifiedHolder, setverifiedsHolder] = useState(false);
  const [isContinue, setContinue] = useState(true);
  const [buttonName, setbuttonName] = useState("continue");
  const {connection} = useConnection();
  const [walletNFTs, setWalletNFTs] = useState<Array<NFT>>([]);

  const [dummy, setDummy] = useState(null)

  const changeButtonName = (event:any) => {
    event.preventDefault();

    const selectedDao = event.target.value; 

    if (selectedDao === "Other") {
      setContinue(true);
      setbuttonName("Continue");
    } else {
      setContinue(false);
      setbuttonName("Verify Holder");
    }

  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const selectedDao = event.target.selectedDao.value;

    if (selectedDao === "Other") {
      setaskedHolder(true);
    } else {
      setaskedHolder(false)
      setbuttonName("verifying...")
      const NFTs = await getNFTsMintAddress(publicKey, connection)
      setWalletNFTs(NFTs)
      setbuttonName("continue")
    }

  }

  if (!askedHolder) {
    return (
      <div className="flex v-screen">
        <form className="m-auto" onSubmit={handleSubmit}>
          <div className="mb-4 w-full">
            <label htmlFor="selectedDao" className="block text-white-700 text-lg mb-2">
              Holder of collab DAO :
              <select name="selectedDao" id="selectedDao" 
              className="block appearance-none w-full bg-gray-200 
              border border-gray-200 text-zinc-900 py-3 px-4 pr-8 
              rounded leading-tight focus:outline-none focus:bg-white 
              focus:border-gray-500" onChange={changeButtonName}> 
                <option value="Other">
                  None
                </option>
                <option value="Atadia">
                  Atadia
                </option>
              </select>
            </label>
          </div>
          <div className="md:flex md:items-center mt-10">
            <div className="m-auto">
            {!publicKey
              ?<button className="text-white bg-gray-400  
              font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              type="submit" disabled={!publicKey}>
              <span> {buttonName} </span>
              </button>
              :<button type="submit" disabled={!publicKey}
                className="text-white bg-gradient-to-br 
                from-purple-600 to-teal-400 hover:bg-gradient-to-bl 
                focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 
                font-medium rounded-lg text-sm px-8 py-2.5 text-center mr-2 mb-2"
                ><span> {buttonName} </span>
                </button>
            }
            {walletNFTs.map(walletNFT => <div>{walletNFT.mint}</div>)}
            </div>
          </div>
        </form>
      </div>
    )
  }
  
  return (
    <div className="w-full">
      <SubmitLend user={user}/>
    </div>
  )
}