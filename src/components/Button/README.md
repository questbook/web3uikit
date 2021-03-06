# Web3UIKit Button

Required props : 
Each of these are functions that return a promise 
- `injectionPromiseSync` : injecting window.ethereum or similar ; unlock wallet here
- `signaturePromiseSync` : Signs the transaction using wallet
- `transactionPromiseSync` : Waits for transaction to be confirmed on blockchain
- `indexerPromiseSync` : Waits for data to be indexed by indexer like graphprotocol
- `callbackPromiseAsync` : this is the only async prop, called after all the steps are complete

Sample : 
```
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
          callbackPromiseAsync={() => {new Promise()}}
          colorScheme="blue">Do Onchain transaction</Button>
```