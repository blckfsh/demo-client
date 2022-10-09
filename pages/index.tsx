import styles from "../styles/Home.module.css";
import type { NextPage } from "next";
import { useState, useEffect, useCallback } from "react";
import { connect, getAdrressDetails, getTotalSupply, getOwnerOfTokenId, mintNft } from "./api/nft";

// declare what the token attributes
type Token = [{
  id: number,
  owner: string
}]

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
      }
    } catch (error) {
      // TODO
    }
  }, [])

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
        <button onClick={() => mintNft(address)}>Mint NFT</button>
        <p>All Minted NFTs</p>
        {
          props.tokens ?
          props.tokens.map((item: {id?: number, owner?: string}, index) => {
            return <div key={index} className={styles.card}>
              <p>Id: {item.id}</p>
              <p>Id: {item.owner}</p>
            </div>
          }) : ''
        }
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  let totalSupply: string = await getTotalSupply();
  let count: number = parseInt(totalSupply);
  let tokens: Token = [{
    id: 0,
    owner: ''
  }];

  tokens.pop(); // this will remove the object inside tokens

  if (count > 0) {
    for (let x: number = 0; x <= count - 1; x++) {
      const owner = await getOwnerOfTokenId(x);
  
      tokens.push({
        id: x,
        owner
      })
    }
  }

  // return the tokens array by initializing it to props
  // In this method, we can read the tokens on the props method
  return {
    props: {
      tokens
    }
  }
}

export default Home
