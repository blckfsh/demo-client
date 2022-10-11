import { ethers } from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";

import MyCoin from "../abi/MyCoin.json"; // import the Nft ABI

let url: string;
let addr: string;
let provider: ethers.providers.JsonRpcProvider;
let contract: ethers.Contract;

url = `${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`; // set the provider url using the alchemy api key
addr = "0xA341c96e0b59d2D3c41bCE76dAfF1Da19a3Db578"; // new smart contract (goerli)
provider = new ethers.providers.JsonRpcProvider(url); // set the RPC provider
contract = new ethers.Contract(addr, MyCoin.abi, provider); // set the contract using contract address, abi, and the provider

// config the web3 connection
export const web3ModalConnect = async () => {
    const web3Modal: Web3Modal = new Web3Modal();
    return web3Modal;
}

// get the signer or provider thru web3 connection
export const getSignerOrProvider = async (needSigner: boolean = false) => {
    const web3Modal: Web3Modal = await web3ModalConnect();
    const instance: any = await web3Modal.connect();
    const web3Provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(instance);

    if (needSigner) {
        const signer: ethers.providers.JsonRpcSigner = web3Provider.getSigner();
        return signer;
    }
    return provider;
}

// get signer (currently selected account on your metamask that has been connected to the dapp)
export const getSigner = async () => {
    const web3Modal: Web3Modal = await web3ModalConnect();
    const instance: any = await web3Modal.connect();
    const web3Provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(instance);
    const signer: ethers.providers.JsonRpcSigner = web3Provider.getSigner();
    return signer;
}

export const connect = async () => {
    const signer: ethers.providers.JsonRpcSigner = await getSigner();
    const address: string = await signer.getAddress();
    return address;
}

// get the address, balance of the connected wallet address
export const getAdrressDetails = async () => {
    const signer: ethers.providers.JsonRpcSigner = await getSigner();
    const address: string = await signer.getAddress();
    const balance: ethers.BigNumber = await signer.getBalance();
    let data: { address: string, balance: string };

    data = {
        address,
        balance: ethers.utils.formatEther(balance).toString()
    }
    return data
}

export const getTotalSupply = async () => {
    const data = await contract.totalSupply();

    return data;
}

export const getBalanceOfCaller = async (address: string) => {
    const data = await contract.balanceOf(address);

    return data;
}

export const mintCoin = async (to: string, value: string) => {
    let override = {
        gasLimit: 300000
    }
    let amount = ethers.utils.parseEther(value);

    const signer: ethers.providers.JsonRpcSigner = await getSigner();
    let contract: ethers.Contract = new ethers.Contract(addr, MyCoin.abi, signer);

    const transaction = await contract.mint(to, amount, override);
    await transaction.wait();
}

export const transferCoin = async (to: string, value: string) => {
    let override = {
        gasLimit: 300000
    }
    
    let amount = ethers.utils.parseEther(value);

    const signer: ethers.providers.JsonRpcSigner = await getSigner();
    let contract: ethers.Contract = new ethers.Contract(addr, MyCoin.abi, signer);

    const transaction = await contract.transfer(to, amount, override);
    await transaction.wait();
}

export const burnCoin = async (value: string) => {
    let override = {
        gasLimit: 300000
    }
    let amount = ethers.utils.parseEther(value);

    const signer: ethers.providers.JsonRpcSigner = await getSigner();
    let contract: ethers.Contract = new ethers.Contract(addr, MyCoin.abi, signer);

    const transaction = await contract.burn(amount, override);
    await transaction.wait();
}