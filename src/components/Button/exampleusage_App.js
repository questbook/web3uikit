import logo from './logo.svg';
import './App.css';
import {default as Button} from './Button';

import { ethers } from 'ethers';
import { useState } from 'react';

const Delay = () => new Promise((r, x) => setTimeout(() => r(), 1000));


function App() {
  let gSigner = null;
  let gProvider = null;
  const [transaction, setTransaction] = useState();
  const [lastRedender, setLastRerender] = useState(0);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Tap button to do on chain transaction
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Web3UIKit
        </a>
        <Button 
          injectionPromiseSync = {() => new Promise(async (r,x) => {
            try{
              const provider = new ethers.providers.Web3Provider(window.ethereum)
              await provider.send("eth_requestAccounts", []);
              const signer = provider.getSigner();
              gSigner = signer;
              gProvider = provider;
              console.log("signer", signer);
              Delay();
              r();
            }catch(e){
              console.log(e);
              x(e);
            }
            })}
          signaturePromiseSync = {() => new Promise(async (r,x) => {
            try{
              const abi = [
                {
                  "inputs": [],
                  "name": "increment",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                }
              ];
              const contract = new ethers.Contract("0xcbA9D809F2BE8dcC0583531cd329aaCb5c1EAD8C", abi, gProvider);
              const contractWithSigner = contract.connect(gSigner);
              const tx = await contractWithSigner.increment();
              const receipt = await tx.wait(1); // need  to use unchecked json rpc to get hash without this wait. This wait should be done in transaction promise
              setTransaction(tx);
              setLastRerender(Date.now());
              r("https://goerli.etherscan.io/tx/"+receipt.transactionHash);
            } catch(e){
              console.log(e);
              x(e);
            }
          })}
          transactionPromiseSync = {() => new Promise(async (r,x) => {
            try{
              console.log(transaction);
              r();
            }catch(e){
              x(e);
            }
          })}
          indexerPromiseSync = {() => new Promise((r,x) => setTimeout(r, 3000))}
          colorScheme="blue">Do Onchain transaction</Button>
      </header>
    </div>
  );
}

export default App;
