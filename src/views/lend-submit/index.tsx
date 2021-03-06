import { FC, useEffect, useState } from "react";
import { SubmitLend } from "components/SubmitLend";
import { DiscordUser } from "utils/types";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getNFTsMintAddress } from "utils/nft"
import { notify } from 'utils/notifications'


interface Props {
  user: DiscordUser;
}

export const SubmitLendView: FC<Props> = (props:Props) => {
  const { user} = props;
  const { publicKey } = useWallet();
  const [askedHolder, setaskedHolder] = useState(false);
  const [verifiedHolder, setverifiedsHolder] = useState(false);
  const [buttonName, setbuttonName] = useState("continue");
  const {connection} = useConnection();
  const [isStaking, setIsStakin] = useState(false)

  useEffect(() => {
    setaskedHolder(false);
    setverifiedsHolder(false);
  }, [publicKey])

  const handleStakingCheckBox = (event: any) => {
    event.preventDefault();
    setIsStakin(!isStaking); 
  }

  const changeButtonName = (event:any) => {
    event.preventDefault();

    const selectedDao = event.target.value; 

    if (selectedDao === "Other") {
      setbuttonName("Continue");
    } else {
      setbuttonName("Verify Holder");
    }

  }

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const selectedDao = event.target.selectedDao.value;

    if (isStaking) {
      if (verifiedHolder) {
        setaskedHolder(true);
      } else {
        const inputMintAddress = event.target.inputMintAddress.value;
        setaskedHolder(false);
        setbuttonName("verifying...");
        checkHoneyStake(inputMintAddress, selectedDao);
      }
    } else if (!isStaking) {
      if ((selectedDao === "Other" ) || (verifiedHolder)) {
        setaskedHolder(true);
      } else {
        setaskedHolder(false);
        setbuttonName("verifying...");
        try {
          const holderNFTsMintAddress = await getNFTsMintAddress(publicKey, connection)
          checkHolder(holderNFTsMintAddress, selectedDao);
        } catch (err) {
          setaskedHolder(false);
          setbuttonName("Verify Holder");
          notify({type:"fail", message:`cannot get token Adress due to ${err}, relax... please try again bro don't open the ticket yet`})
        }
      }
    }
  }

  const checkHolder = async (
    holderNFTsMintAddress: any[], 
    selectedDao: String) => {
      
      try {
        if (holderNFTsMintAddress.length > 0) {
          const parsedHolderNFtsMintAddress = holderNFTsMintAddress.map(
            function(e) {
            e.mint = String(e.mint);
            return e.mint;
          });
          const respDaoNFTsMintAddress = await fetch(`https://atadia-lending-lab-backend.herokuapp.com/get-hashlist/${selectedDao}`);
          const daoNFTsMintAddress = await respDaoNFTsMintAddress.json();
          const intersectMintAddress = parsedHolderNFtsMintAddress.filter(x => daoNFTsMintAddress.includes(x));
          if (intersectMintAddress.length > 0) {
            setverifiedsHolder(true);
            setbuttonName("Continue");
            notify({type:"success", message:"Your holder status is successfully verified. Please proceed to submit loan application."})
          } else {
            setverifiedsHolder(false);
            setbuttonName("Verify Holder");
            notify({type:"fail", message:"We can't find any associated token, try again"})
          }
        } else {
          setverifiedsHolder(false);
          setbuttonName("Verify Holder");
          notify({type:"fail", message:"You don't have any NFTs in your wallets"})
      }
    } catch (err) {
      setbuttonName("Verify Holder");
      notify({type:"fail", message:`cannot get hashlist of DAOs due to ${err}, relax... please try again bro don't open the ticket yet`})
    }
  }

  const checkHoneyStake = async (
    inputMintAddress : string,
    selectedDao: string
  ) => {
    
    try {
      const userPublickey = String(publicKey)
      const stakingProgramIdArr = [
        "bankHHdqMuaaST4qQk6mkzxGeKPHWmqdgor6Gs8r88m",
        "farmL4xeBFVXJqtfxCzU9b28QACM7E2W2ctT6epAjvE"
      ];
      const respDaoNFTsMintAddress = await fetch(`https://atadia-lending-lab-backend.herokuapp.com/get-hashlist/${selectedDao}`);
      const daoNFTsMintAddress = await respDaoNFTsMintAddress.json();
      const respTokenTransactions = await fetch(`https://api.solscan.io/account/transaction?address=${inputMintAddress}`);
      const respTokenTransactionsJson = await respTokenTransactions.json();
      const dataArr = respTokenTransactionsJson.data;
      const firstData = dataArr[0];
      const signerArr = firstData.signer;
      const programIdArr = firstData.parsedInstruction.map(
        function(e) {
          return e.programId
        } 
      );
      
      const checkedInputMintAddress = daoNFTsMintAddress.includes(inputMintAddress);
      const intersectProgramId = stakingProgramIdArr.filter(x => programIdArr.includes(x));
      const checkedSigner = signerArr.includes(userPublickey);

      if (checkedInputMintAddress) {
        if (intersectProgramId.length > 0) {
          if (checkedSigner) {
            setverifiedsHolder(true);
            setbuttonName("Continue");
            notify({type:"success", message:"Your holder status is successfully verified. Please proceed to submit loan application."});
          } else if (!checkedSigner) {
            setverifiedsHolder(false);
            setbuttonName("Verify Holder");
            notify({type:"fail", message:"wallet not matched"});
          } else {
            setverifiedsHolder(false);
            setbuttonName("Verify Holder");
            notify({type:"fail", message:"Try again"});
          }
        } else if (intersectProgramId.length === 0) {
          setverifiedsHolder(false);
          setbuttonName("Verify Holder");
          notify({type:"fail", message:"program id not matched"});
        } else {
          setverifiedsHolder(false);
          setbuttonName("Verify Holder");
          notify({type:"fail", message:"Unknow error"});
        }
      } else if (!checkedInputMintAddress) {
        setverifiedsHolder(false);
        setbuttonName("Verify Holder");
        notify({type:"fail", message:`Not ${selectedDao} token, sir`});
      }
    } catch (err) {
      setbuttonName("Verify Holder");
      notify({type:"fail", message:`cannot get check staking due to ${err}, relax... please try again bro don't open the ticket yet`})
    }

    //setStakeProg(programIdArr);
    //setSigNer(signerArr);

  }


  if (!askedHolder) {
    return (
      <div className="flex v-screen">
        <form className="bg-zinc-800 shadow-md rounded w-1/4 p-7 m-auto" onSubmit={handleSubmit}>
          <div className="mb-4 w-full">
            <label htmlFor="selectedDao" className="block text-white-700 text-lg mb-2">
                You are a holder of :
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

          {isStaking
          ?<div className="mb-4 w-full">
            <label htmlFor="inputMintAddress"
              className="block text-white-700 text-lg mb-2">
              NFT token address
            </label>
            <input type="text" id="inputMintAddress" name="inputMintAddress"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-900 
            leading-tight focus:outline-none focus:shadow-outline"
              required />
            <div className="py-5">
              <a>You???ll first need to get this from solscan in SPL token transfer
              If you can't find it because of too many transactions, just unstake 
              it and don't forget to write it down so that it can be used next time</a><br/>
            </div>
          </div>
          :<div className="mb-4 w-full"></div>}

          <div className="mb-4 w-full">
          <input type="checkbox" checked={isStaking} onChange={handleStakingCheckBox} />
            <label> My NFT is currently staked. </label>
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
            
            </div>
          </div>
        </form>
      </div>
    )
  }
  
  return (
    <div className="w-full">
      <SubmitLend user={user} verifiedHolder={verifiedHolder}/>
    </div>
  )
}