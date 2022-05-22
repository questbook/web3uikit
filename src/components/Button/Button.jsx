import React, { useContext, useState } from "react";
import { Button, Tooltip } from '@chakra-ui/react'


const Web3Button = (props) => {
    const STEPS = {
        "click" : 0,
        "injection": 1, 
        "signature": 2,
        "transaction": 3,
        "indexer": 4,
        "complete": 5,
    };
    const [error, setError] = useState({ hasError: false });
    const [lastRender, setLastRerender] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const wait = {
        click: props.clickWaitText || "Tap the button to initiate an onchain transaction",
        injection: props.injectionWaitText || "Waiting for connection to wallet",
        signature: props.signatureWaitText || "Waiting for signature from wallet",
        transaction: props.transactionWaitText || "Waiting for transaction to confirm on-chain",
        indexer: props.indexerWaitText || "Waiting for transaction to be indexed"
    };
    const [done, setDone] = useState({});
    const [step, setStep] = useState();
    const onClick = async () => {
        setIsLoading(true);
        setStep("click");
        setDone({ click: props.clickDoneText || "Transaction flow initiated"})
        if(props.injectionPromiseSync){
            console.log("calling injection");
            try {
                await props.injectionPromiseSync();
                done.injection = props.injectionDoneText || "Wallet connected";
                setDone(done);
                setLastRerender(Date.now());
            }
            catch(e){
                console.error(e);
                const _error = error;
                _error.hasError = true;
                await setError(_error);
                setLastRerender(Date.now());
                console.log(_error);
                setIsLoading(false);
                return;
            }
        }
        setStep("injection");
        if(props.signaturePromiseSync){
            console.log("calling signature");
            try{
                const scanLink = await props.signaturePromiseSync();
                done.signature = props.signatureDoneText || `Transaction has been signed` ;
                done.txLink = scanLink;
                setDone(done);
                setLastRerender(Date.now());
            }
            catch(e){

                error.signature = e;
                error.hasError = true;
                await setError(error);
                setLastRerender(Date.now());
                setIsLoading(false);
                console.log("cancel signature", error);
                return;
            }
        }
        setStep("signature");
        if(props.transactionPromiseSync){
            console.log("calling transaction");
            try{
                await props.transactionPromiseSync();
                done.transaction = props.transactionDoneText || "Transaction has been confirmed";
                setDone(done);
                setLastRerender(Date.now());
            }
            catch(e){
                error.transaction = e;
                error.hasError = true;
                setError(error);
                setLastRerender(Date.now());
                setIsLoading(false);
                return;
            }
        }
        setStep("transaction");
        if(props.indexerPromiseSync){
            console.log("calling indexer");
            try{
                await props.indexerPromiseSync();
                done.indexer = props.indexerDoneText || "Transaction is complete and indexed";
                setDone(done);
                setLastRerender(Date.now());
            }
            catch(e){
                error.indexer = e;
                error.hasError = true;
                setError(error);
                setLastRerender(Date.now());
                setIsLoading(false);
                return;
            }
        }
        setStep("indexer");
        props.callbackPromiseAsync();
        setIsLoading(false);

        
    }

    const Indicator = (props) => {
        let color = "#eee";
        let text = "";
        let link = "#";
        
        const currentStep = step;
        const mStep = props.step;
        if(!currentStep){
            color = "#aaa";
            text = wait[mStep];
        }
        else if(STEPS[mStep] <= STEPS[currentStep]){
            color = "#0f0";
            text = done[mStep];
            if(mStep == "transaction"){
                link = done.txLink;
            }
        }
        else {
            color = "#aaa";
            text = wait[mStep];
        }
        console.log(error);
        if(error.hasError && STEPS[mStep] <= STEPS[currentStep]){
            color="#f00";
            if(mStep in error){
                text=error[mStep].message;
            }
        }
        return <Tooltip label={text}>
            <a href={link} style={{ marginLeft: 10, height: 5, width: 5, background: color, ...props.style}}></a>
        </Tooltip>
    }

    return <div style={{ textAlign: 'center'}}>
        <Button isLoading={isLoading} {...props} onClick={onClick}>
            {props.children}
        </Button>
        <div style={{paddingTop: 5, width: 65, flexDirection: 'row', display: 'flex', margin: "0px auto"}}>
            <Indicator step="click" style={{ marginLeft: 0}}/>
            <Indicator step="injection" />
            <Indicator step="signature" />
            <Indicator step="transaction" />
            <Indicator step="indexer" />
        </div>
    </div>
};
  
  export default Web3Button;
  