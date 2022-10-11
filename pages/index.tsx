import styles from "../styles/Home.module.css";
import type { NextPage } from "next";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { connect, getAdrressDetails, getTotalSupply, getBalanceOfCaller, mintCoin, transferCoin, burnCoin } from "./api/ft";


// declare the props attributes
type Props = {
  tokens: [];
}

// create interface for the props
interface FuncProps {
  tokens: [];
}

const Home: NextPage<Props> = (props: FuncProps) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [balance, setBalance] = useState(0);

  // config the wallet address connection
  const config = useCallback(async () => {
    try {
      const account = await connect();

      if (account != null) {
        getDetails();
      }
    } catch (error) {
      // TODO
    }
  }, [])

  // get the details of connected wallet address
  const getDetails = useCallback(async () => {
    try {
      const account = await getAdrressDetails();

      if (account) {
        setAddress(account.address);
        getBalance(account.address);
      }
    } catch (error) {
      // TODO
    }
  }, [])

  const getBalance = async (address: string) => {
    const data = await getBalanceOfCaller(address);

    setBalance(data.toString());
  }

  useEffect(() => {
    try {
      config();
    } catch (error) {
      // TODO
    }
  }, [])

  return (
    <div className={styles.container}>
      <h1>Mint NFTs</h1>
      <p>wallet address connected: { address }</p>
      <div>
        <p>Balance: MyCoin (ERC20): { ethers.utils.formatEther(balance) }</p>
      </div>
      <div className={styles.card}>
        <div><h3>Mint Coin</h3></div>
        <label>Amount: </label>
        <input className={styles.mr3} type="number" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button onClick={() => mintCoin(address, amount)}>Mint</button>
      </div>
      <div className={styles.card}>
        <div><h3>Transfer Coin</h3></div>
        <label>Amount: </label>
        <input type="number" className={styles.mr3} name="transferAmount" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
        <label>Recipient Address: </label>
        <input type="text" className={styles.mr3} name="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        <button onClick={() => transferCoin(recipient, transferAmount)}>Transfer</button>
      </div>
      <div className={styles.card}>
        <div><h3>Burn Coin</h3></div>
        <label>Amount: </label>
        <input type="number" className={styles.mr3} name="burnAmount" value={burnAmount} onChange={(e) => setBurnAmount(e.target.value)} />
        <button onClick={() => burnCoin(burnAmount)}>Burn</button>
      </div>        
    </div>
  )
}

export default Home
