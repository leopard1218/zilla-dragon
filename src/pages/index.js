import React, { useState, useEffect } from 'react';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import Members from '../components/Members';
import MintBanner from '../components/MintBanner';
import RoadMap from '../components/RoadMap';
import { ToastContainer, toast } from "react-toastify";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Web3 from "web3";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

import SmartContract from "../../ABI/BoredZillaClub.json";
import { errorAlert, warningAlert } from '../components/toastGroup';
import { CHAIN_ID, MAX_BUYABLE, PRICE, SmartContractAddress } from '../../config';
import whitelist from '../../whitelist.json';
import { Typography } from '@mui/material';

const MintAlert = withReactContent(Swal)

let web3 = undefined;
let web3Modal = undefined;
let connection = undefined;
let provider = undefined;
let signer = undefined;
let contract = undefined;
const errors = [
 /*0*/ "The wrong network, please switch to the Rinkeby network.",
 /*1*/  "First, you should connect it with your wallet.",
 /*2*/  "You can't get more Zillas at this stage!",
 /*3*/  "SALE has not Started!",
 /*4*/  "Amount Exceed!",
 /*5*/  "Amount Exceed! No more than 1700 NFTs are provided during the pre-sale stage.",
 /*6*/  "You are not a WhiteListed Person! In the pre-sale stage, only owners in the WhiteListed can get.",
 /*7*/  "In PRESALE Stage, you can buy ONLY 2 Zillas!",
 /*8*/  "Your balance is not enough.",
 /*9*/  "You can buy a maximum of 4 Zillas.",
/*10*/  "Oops. We find the unknown error. Please try again.",
]
export default function Home() {

  const [isLoading, setIsLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [signerAddress, setSignerAddress] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);
  const [totalMinted, setTotalMinted] = useState(0)
  const [currentStage, setCurrentStage] = useState(0) // 0: pre-sail stage, 1: public stage
  const [totalPrice, setTotalPrice] = useState(PRICE[0]);
  const [amount, setAmount] = useState(1);
  const [started, setStarted] = useState(false);
  const [timeLimit, setTimeLimit] = useState(true); // timelimit is true for 3 hours
  const [incLoding, setIncLoading] = useState(false);
  const [decLoding, setDecLoading] = useState(false);
  const [locked, setLocked] = useState(true);

  const checkNetwork = async () => {
    web3 = new Web3(Web3.givenProvider);
    const chainId = await web3.eth.getChainId()
    if (chainId !== CHAIN_ID) {
      errorAlert(errors[0])
      return false
    } else {
      return true
    }
  }

  const increaseAmount = async () => {
    setIncLoading(true);
    try {
      if (!await getStartSale()) throw 3;
      if (!await checkNetwork()) return;
      await checkTimeLimit()
      if (!await getSignerAddress()) throw 1;
      if (amount >= 1 && amount < MAX_BUYABLE[currentStage]) {
        setAmount(amount + 1);
        setTotalPrice(PRICE[currentStage] * (amount + 1));
        setIncLoading(false);
      } else throw 2;
    } catch (err) {
      errorAlert(errors[err])
      setIncLoading(false);
    }
    setIncLoading(false);
  }

  const decreaseAmount = async () => {
    setDecLoading(true)
    try {
      if (!await getStartSale()) throw 3;
      if (!await checkNetwork()) return;
      await checkTimeLimit()
      if (!await getSignerAddress()) throw 1;
      if (amount > 1 && amount <= MAX_BUYABLE[currentStage]) {
        setAmount(amount - 1);
        setTotalPrice(PRICE[currentStage] * (amount - 1));
        setDecLoading(false)
      }
    } catch (err) {
      errorAlert(errors[err])
      setDecLoading(false)
    }
    setDecLoading(false)
  }

  const handleConnect = async () => {
    if (await checkNetwork())
      ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(
          async () => {
            setSignerAddress(await getSignerAddress());
            setCurrentBalance(await getSignerBalance(await getSignerAddress()));
            setConnected(true);
            setLocked(false);
            toast.dismiss();
            web3Modal = new Web3Modal();
            connection = await web3Modal.connect();
            provider = new ethers.providers.Web3Provider(connection);
            signer = provider.getSigner();
            contract = new ethers.Contract(
              SmartContractAddress,
              SmartContract,
              signer
            );
            setTotalMinted(await getTotalMinted());
            await getStartSale();
            await checkTimeLimit();
            await getSignerBalance(await getSignerAddress());
          }
        )
        .catch((err) => {
          if (err.code === -32002) {
            warningAlert('Please connect to MetaMask!')
          } else if (err.code === 4001) {
            warningAlert('You rejected the connect, please connect the MetaMask');
          } else {
            console.log(err);
          }
        });
  }

  const getSignerAddress = async () => {
    const accounts = await web3.eth.getAccounts();
    if (accounts[0] === undefined) {
      setConnected(false)
      return false
    }
    else return accounts[0]
  }

  const getTotalMinted = async () => {
    let minted = await contract.totalMinted();
    minted = parseInt(minted.toString());
    if (minted >= 1700) {
      setCurrentStage(1);
    }
    setTotalMinted(minted);
    return minted;
  }

  const getSignerBalance = async (address) => {
    const balance = await web3.eth.getBalance(address);
    setCurrentBalance(balance);
    return balance;
  }

  const checkTimeLimit = async () => {
    const startTime = await contract.startTime();
    const limitTime = new Date(parseInt(startTime.toString()) * 1000 + 3600 * 3 * 1000);
    const now = new Date();
    if (limitTime > now) return true;
    else {
      setCurrentStage(1);
      setTimeLimit(false);
      return false;
    }
  }

  const getWhitelistState = (address) => {
    const state = whitelist.includes(address);
    return state
  }

  const getStartSale = async () => {
    const state = await contract.start();
    setStarted(state);
    return state
  }

  const getBalanceOf = async (addresss) => {
    const value = await contract.balanceOf(addresss);
    return value.toString()
  }

  const mint = async () => {
    toast.dismiss();
    setIsLoading(true);
    try {
      if (!await checkNetwork()) { setIsLoading(false); return; }
      if (!await getSignerAddress()) throw 1;
      if (!await getStartSale()) throw 3;
      if (parseInt(await getTotalMinted()) + amount > 3333) throw 4;
      if (await checkTimeLimit()) {
        if (parseInt(await getTotalMinted()) + amount > 1700) throw 5;
        if (!getWhitelistState(signerAddress)) throw 6;
        if (parseInt(amount) + parseInt(await getBalanceOf(signerAddress)) > 2) throw 7;
      } else {
        if (parseInt(amount) + parseInt(await getBalanceOf(signerAddress)) > 4) throw 11;
      }
      if (totalPrice > ethers.utils.formatEther(currentBalance)) throw 8;

      await contract.mint(amount, {
        value: ethers.utils.parseUnits(totalPrice.toString(), 18)
      });

      MintAlert.fire({
        title:
          <Typography component="h2">
            Congratulation!
          </Typography>,
        html:
          <Typography component="p">
            You got the Zillas.
          </Typography>,
        icon: 'success'
      })

      getSignerBalance(signerAddress);
    } catch (err) {
      setIsLoading(false);
      if (err < 10) {
        errorAlert(errors[err]);
      } else if (err === 11) {
        errorAlert(`You can buy a maximum of 4 Zillas. You already got ${await getBalanceOf(signerAddress)} Zilla(s).`)
      } else {
        errorAlert(errors[10]);
        console.log(err);
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    handleConnect();
  }, [signerAddress, currentBalance])

  useEffect(async () => {
    ethereum.on('chainChanged', (chainId) => {
      if (parseInt(chainId) === CHAIN_ID) {
        handleConnect()
        setLocked(false);
      } else {
        setConnected(false);
        setLocked(true);
        checkNetwork();
      }
    })
    ethereum.on('accountsChanged', () => {
      setConnected(false);
      setLocked(true);
      checkNetwork();
    }, [handleConnect]);

    // if (await getSignerAddress()) {
    //   const reRender = setInterval(() => {
    //     handleConnect()
    //   }, 15000);
    // }


  }, [])
  return (
    <>
      <Header
        connected={connected}
        address={signerAddress}
        handleConnect={handleConnect}
      />
      <HeroBanner />
      <MintBanner
        connected={connected}
        mint={mint}
        balance={ethers.utils.formatEther(currentBalance)}
        totalMinted={totalMinted}
        increaseAmount={increaseAmount}
        decreaseAmount={decreaseAmount}
        currentStage={currentStage}
        amount={amount}
        timeLimit={timeLimit}
        totalPrice={totalPrice.toString()}
        isLoading={isLoading}
        started={started}
        incLoding={incLoding}
        decLoding={decLoding}
        locked={locked}
      />
      <RoadMap />
      <FAQ />
      <Members />
      <Footer />
      <ToastContainer style={{ fontSize: 12, padding: "5px !important", lineHeight: "15px" }} />
    </>
  );
}
