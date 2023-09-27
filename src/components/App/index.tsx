import useWalletProvider from '../../hooks/useWalletProvider';
import { ReactComponent as Warning } from '../../icons/warning.svg';
import { Button, State, Status } from '../Button';
import { TypedDataField, ethers } from 'ethers';
import { ChainId } from '../../cctp-sdk/constants';
import { transfer } from '../../cctp-sdk';
import { useState } from 'react';
import Header from '../Header';
import Price from '../Price';
import Path from '../Path';
import './style.css';
import Input from '../Amount';

const DECIMALS = 6;
const SRC_MAX_FEE = ethers.parseUnits("1", 6);
const DST_MAX_FEE = ethers.parseUnits("1", 6);

const App = () => {
  const [srcChainId, setSrcChainId] = useState<ChainId | null>(null);
  const [dstChainId, setDstChainId] = useState<ChainId | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [amount, setAmount] = useState<bigint>(0n);
  const wallet = useWalletProvider();

  const onTransfer = async () => {
    if (!srcChainId || !dstChainId)
      return;

    if (SRC_MAX_FEE + DST_MAX_FEE > amount)
      return setStatus({ state: State.Failed, message: 'Max fee amount exceeds total amount' })

    setStatus({ state: State.Pending, message: 'Waiting for signatures' });
    
    const signer = await wallet.getSigner();

    if (!signer)
      return setStatus({ state: State.Failed, message: 'Wallet connection denied' });

    /*const balance = await token.balanceOf(signer.address);
    if (balance < amount)
      return setSignStatus({ state: State.failed, message: 'Insufficient balance' });*/

    try {
      let signatureCount = 0;

      const signTypedData = async (
        domain: ethers.TypedDataDomain,
        types: Record<string, Array<TypedDataField>>,
        value: Record<string, any>
      ): Promise<string> => {
        const chainId = Number(domain.chainId) as ChainId;
        const name = ChainId[chainId];

        switch (signatureCount) {
          case 0:
          case 1:
            setStatus({ state: State.Pending, message: 'Waiting for authorization on ' + name });
            break;
          case 2:
            setStatus({ state: State.Pending, message: 'Waiting for signature on ' + name });
            break;
        }

        if (!await wallet.switchNetwork(chainId))
          throw new Error("Refused to switch to " + name);

        try {
          const signature = await signer.signTypedData(domain, types, value);

          if (signatureCount === 2)
          setStatus({ state: State.Pending, message: 'Waiting for transaction' });

          signatureCount++;
          return signature;
        } catch (e) {
          throw new Error("Signature denied");
        }
      };

      await transfer(
        signer.address,
        amount,
        SRC_MAX_FEE,
        DST_MAX_FEE,
        srcChainId,
        dstChainId,
        signTypedData
      );

      setStatus({ state: State.Success, message: 'Transfer successfully initiated' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus({ state: State.Failed, message: msg });
    }
  };

  const onChangeChain = (src: ChainId, dst: ChainId) => {
    setSrcChainId(src);
    setDstChainId(dst);
  };

  return (
    <div className='App'>
      <div className='container'>
        <Header />
        <main>
          <div className='product'>
            <div className='audit'>
              <span className='warning'><Warning /></span>
              <div className='content'>
                <span>Code is not yet audited by a third party</span>
                <span>Please use at your own discretion</span>
              </div>
            </div>
            <div className='image'>
              <div>
                <Path onChange={onChangeChain} />
                <Input name='Amount' decimals={DECIMALS} onChange={(num) => setAmount(num)} />
              </div>
            </div>
            <div className='total'>
              <div>
                <span>{ ChainId[srcChainId!] } max fee</span>
                <Price amount={SRC_MAX_FEE} decimals={6} />
              </div>
              <div>
                <span>{ ChainId[dstChainId!] } max fee</span>
                <Price amount={DST_MAX_FEE} decimals={6} />
              </div>
              <hr />
              <div>
                <span>Minimum received</span>
                <Price amount={amount > SRC_MAX_FEE + DST_MAX_FEE ? amount - SRC_MAX_FEE - DST_MAX_FEE : 0n} decimals={6} />
              </div>
            </div>
            <Button status={ status } onClick={ onTransfer }>Transfer</Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
